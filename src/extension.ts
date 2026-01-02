import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { exec } from 'child_process';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('copy-for-ai.makeTxt', async (uri: vscode.Uri) => {
        // 1. Obtener el recurso (archivo) seleccionado o el activo
        const resource = uri || vscode.window.activeTextEditor?.document.uri;
        if (!resource) {
            vscode.window.showErrorMessage('No hay archivo seleccionado.');
            return;
        }

        try {
            // 2. Leer el documento y preparar rutas
            const document = await vscode.workspace.openTextDocument(resource);
            const content = document.getText();
            const originalFileName = path.basename(resource.fsPath);

            // Usamos la carpeta temporal del sistema
            const tempDir = os.tmpdir();
            // Añadimos la extensión .txt para asegurar que la IA lo lea como texto plano
            const tempFilePath = path.join(tempDir, `${originalFileName}.txt`);

            // 3. Escribir el contenido en el archivo temporal
            fs.writeFileSync(tempFilePath, content);

            // 4. Preparar el script de PowerShell
            // IMPORTANTE: Escapar comillas simples en la ruta para que PowerShell no falle
            const safeTempFilePath = tempFilePath.replace(/'/g, "''");

            const psScript = `
                Add-Type -AssemblyName System.Windows.Forms;
                $fileList = New-Object System.Collections.Specialized.StringCollection;
                $fileList.Add('${safeTempFilePath}');
                [System.Windows.Forms.Clipboard]::SetFileDropList($fileList);
            `;

            // 5. Ejecutar PowerShell
            // FIX: Añadimos la bandera '-Sta' (Single Threaded Apartment) necesaria para Windows 10
            const command = `powershell -NoProfile -Sta -Command "${psScript.replace(/\n/g, ' ').trim()}"`;

            exec(command, (error, stdout, stderr) => {
                if (error) {
                    vscode.window.showErrorMessage(`Error al copiar en Windows 10: ${stderr || error.message}`);
                    return;
                }
                vscode.window.showInformationMessage(`✅ '${originalFileName}' listo. Pégalo (Ctrl+V) en la IA.`);
            });

        } catch (error: any) {
            vscode.window.showErrorMessage(`Error técnico: ${error.message}`);
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}