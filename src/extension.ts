import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { exec } from 'child_process';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('copy-for-ai.makeTxt', async (uri: vscode.Uri) => {
        const resource = uri || vscode.window.activeTextEditor?.document.uri;

        if (!resource) {
            vscode.window.showErrorMessage('No hay archivo seleccionado.');
            return;
        }

        try {
            const document = await vscode.workspace.openTextDocument(resource);
            const content = document.getText();
            const originalFileName = path.basename(resource.fsPath);

            // 1. Ruta en la carpeta TEMPORAL
            const tempDir = os.tmpdir();
            const tempFilePath = path.join(tempDir, `${originalFileName}.txt`);

            // 2. Escribimos el contenido
            fs.writeFileSync(tempFilePath, content, 'utf8');

            // 3. COMANDO UNIVERSAL: Usa .NET para copiar el archivo al portapapeles
            // Este script crea una colección de archivos (de uno solo) y la inyecta en el Clipboard
            const psScript = `
                Add-Type -AssemblyName System.Windows.Forms;
                $fileList = New-Object System.Collections.Specialized.StringCollection;
                $fileList.Add('${tempFilePath.replace(/'/g, "''")}');
                [System.Windows.Forms.Clipboard]::SetFileDropList($fileList);
            `;

            // Ejecutamos limpiando espacios y saltos de línea del script
            const command = `powershell -NoProfile -Command "${psScript.replace(/\n/g, '').trim()}"`;

            exec(command, (error, stdout, stderr) => {
                if (error) {
                    vscode.window.showErrorMessage(`Error al copiar: ${stderr || error.message}`);
                    return;
                }
                vscode.window.showInformationMessage(`✅ '${originalFileName}' listo para pegar (Ctrl+V) en la IA.`);
            });

        } catch (error: any) {
            vscode.window.showErrorMessage(`Error técnico: ${error.message}`);
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}