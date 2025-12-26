📋 Copy for AI - VS Code Extension
Esta extensión permite copiar el contenido de cualquier archivo directamente al portapapeles de Windows como un archivo físico adjunto.

🚀 ¿Por qué usar esta extensión?
Cuando copias y pegas bloques de código gigantes en chats de IA (ChatGPT, Claude), el navegador se ralentiza o se bloquea debido al renderizado del texto. Esta extensión soluciona el problema:

Crea un archivo .txt temporal en tu sistema.

Lo inyecta en el portapapeles como una referencia de archivo.

Al hacer Ctrl + V en el chat, la IA lo recibe como un adjunto, evitando el lag y ahorrando recursos.

🛠️ Instalación (Uso personal)
Para instalarla en cualquier ordenador sin pasar por el Marketplace:

Generar el archivo .vsix: En la carpeta del proyecto, ejecuta:

Bash

npx @vscode/vsce package
Instalar en VS Code:

Abre VS Code.

Ve a la pestaña de Extensiones (Ctrl + Shift + X).

Haz clic en los tres puntos (...) en la esquina superior derecha.

Selecciona Install from VSIX....

Elige el archivo .vsix generado.

💻 Desarrollo y Mejora Futura
Si quieres añadir nuevas funciones o modificar el comportamiento, estos son los comandos esenciales:

Comandos de Terminal
npm install: Instala las dependencias necesarias.

npm run watch: Compila automáticamente los cambios de TypeScript a JavaScript en tiempo real. (Mantén esto abierto mientras programas).

npm run compile: Compila el proyecto una sola vez.

npx @vscode/vsce package: Empaqueta la extensión en un archivo instalable .vsix.

Cómo probar cambios
Abre el proyecto en VS Code.

Pulsa F5. Se abrirá una ventana nueva llamada [Extension Development Host].

Prueba la extensión en esa ventana.

Si haces cambios en el código, pulsa el botón Restart (flecha circular verde) en la barra flotante de depuración para aplicar los cambios al instante.

🔍 Detalles Técnicos (Para Obsidian)
El "Truco" del Portapapeles
La extensión no usa la API estándar de VS Code para el portapapeles porque esta solo permite texto plano. En su lugar, utiliza un script de PowerShell con .NET:

TypeScript

Add-Type -AssemblyName System.Windows.Forms;
$fileList = New-Object System.Collections.Specialized.StringCollection;
$fileList.Add('RUTA_AL_ARCHIVO');
[System.Windows.Forms.Clipboard]::SetFileDropList($fileList);
Ubicación Temporal: Los archivos se guardan en os.tmpdir() (la carpeta Temp de Windows), por lo que no ensucian tus proyectos actuales.

Compatibilidad: Diseñado para Windows 10/11.

📝 Roadmap / Ideas para mejorar
[ ] Añadir opción para copiar múltiples archivos seleccionados a la vez.

[ ] Crear un comando para limpiar la carpeta temporal manualmente.

[ ] Añadir soporte para Linux (xclip) y macOS (pbcopy).

Creado por David | Optimizando el flujo de trabajo con IA 🤖✨