#!/usr/bin/env python3
"""
Hardware Playground Project Decoder
Decodes the compressed project structure and creates the complete folder structure.
"""

from pathlib import Path
import base64
import zipfile
import io

# Compressed project data (base64 encoded)
PROJECT_DATA = """
UEsDBBQAAAAIAEpfZ1cAAAAAAAAAAAAAAAAJAAAAY29yZS9AZGVjb2RlZCBmaWxlcyB3aWxsIGJl
IGNyZWF0ZWQgaGVyZVBLAwQUAAAACABKX2dXAAAAAAAAAAAAAAAAEAAAAGNvcmUvdHlwZXMvUEsD
BBQAAAAIAEpfZ1cAAAAAAAAAAAAAAAARAAAAY29yZS90eXBlcy9pbmRleC50c1BLAwQUAAAACABK
X2dXAAAAAAAAAAAAAAAAFAAAAGNvcmUvdHlwZXMvSGFyZHdhcmUudHNQSwMEFAAAAAgASl9nVwAA
AAAAAAAAAAAAABUAAABjb3JlL3R5cGVzL1BsYXlncm91bmQudHNQSwMEFAAAAAgASl9nVwAAAAAAAAAAAAAAABMAAABjb3JlL3R5cGVzL0NvbnRlbnQudHNQSwMEFAAAAAgASl9nVwAAAAAAAAAAAAAAABgAAABjb3JlL3R5cGVzL0NvbW11bmljYXRpb24udHNQSwMEFAAAAAgASl9nVwAAAAAAAAAAAAAAABEAAABjb3JlL2NvbmZpZy9pbmRleC50c1BLAwQUAAAACABKX2dXAAAAAAAAAAAAAAAAFAAAAGNvcmUvY29uZmlnL0FwcENvbmZpZy50c1BLAwQUAAAACABKX2dXAAAAAAAAAAAAAAAAEQAAAGNvcmUvdXRpbHMvaW5kZXgudHNQSwMEFAAAAAgASl9nVwAAAAAAAAAAAAAAABkAAABjb3JlL3V0aWxzL1ZhbGlkYXRpb25VdGlscy50c1BLAwQUAAAACABKX2dXAAAAAAAAAAAAAAAAFQAAAGNvcmUvdXRpbHMvQ29kZUdlbmVyYXRvci50c1BLAwQUAAAACABKX2dXAAAAAAAAAAAAAAAAEwAAAGNvcmUvdXRpbHMvRXJyb3JVdGlscy50c1BLAwQUAAAACABKX2dXAAAAAAAAAAAAAAAAEgAAAG1vZHVsZXMvYmFzZS9pbmRleC50c1BLAwQUAAAACABKX2dXAAAAAAAAAAAAAAAAHAAAAG1vZHVsZXMvYmFzZS9CYXNlSGFyZHdhcmVNb2R1bGUudHNQSwMEFAAAAAgASl9nVwAAAAAAAAAAAAAAABcAAABtb2R1bGVzL2Jhc2UvQmxvY2tCdWlsZGVyLnRzUEsDBBQAAAAIAEpfZ1cAAAAAAAAAAAAAAAAVAAAAbW9kdWxlcy9yZWdpc3RyeS9pbmRleC50c1BLAwQUAAAACABKX2dXAAAAAAAAAAAAAAAAHAAAAG1vZHVsZXMvcmVnaXN0cnkvTW9kdWxlUmVnaXN0cnkudHNQSwMEFAAAAAgASl9nVwAAAAAAAAAAAAAAAB4AAABtb2R1bGVzL2ltcGxlbWVudGF0aW9ucy9pbmRleC50c1BLAwQUAAAACABKX2dXAAAAAAAAAAAAAAAAIQAAAG1vZHVsZXMvaW1wbGVtZW50YXRpb25zL0xlZE1vZHVsZS50c1BLAwQUAAAACABKX2dXAAAAAAAAAAAAAAAAJAAAAG1vZHVsZXMvaW1wbGVtZW50YXRpb25zL05lb1BpeGVsTW9kdWxlLnRzUEsDBBQAAAAIAEpfZ1cAAAAAAAAAAAAAAAAjAAAAbW9kdWxlcy9pbXBsZW1lbnRhdGlvbnMvU2Vydm9Nb2R1bGUudHNQSwMEFAAAAAgASl9nVwAAAAAAAAAAAAAAACMAAABtb2R1bGVzL2ltcGxlbWVudGF0aW9ucy9CdXp6ZXJNb2R1bGUudHNQSwMEFAAAAAgASl9nVwAAAAAAAAAAAAAAABMAAABwbGF5Z3JvdW5kL2luZGV4LnRzUEsDBBQAAAAIAEpfZ1cAAAAAAAAAAAAAAAATAAAAcGxheWdyb3VuZC9lbmdpbmUvUEsDBBQAAAAIAEpfZ1cAAAAAAAAAAAAAAAAdAAAAcGxheWdyb3VuZC9lbmdpbmUvUGxheWdyb3VuZEVuZ2luZS50c1BLAwQUAAAACABKX2dXAAAAAAAAAAAAAAAAGAAAAHBsYXlncm91bmQvZW5naW5lL2luZGV4LnRzUEsDBBQAAAAIAEpfZ1cAAAAAAAAAAAAAAAAbAAAAcGxheWdyb3VuZC9jb21tdW5pY2F0aW9uL1BLAwQUAAAACABKX2dXAAAAAAAAAAAAAAAAJAAAAHBsYXlncm91bmQvY29tbXVuaWNhdGlvbi9EZXZpY2VIYW5kbGVyLnRzUEsDBBQAAAAIAEpfZ1cAAAAAAAAAAAAAAAApAAAAcGxheWdyb3VuZC9jb21tdW5pY2F0aW9uL1dlYlNlcmlhbENvbW11bmljYXRvci50c1BLAwQUAAAACABKX2dXAAAAAAAAAAAAAAAAIAAAAHBsYXlncm91bmQvY29tbXVuaWNhdGlvbi9pbmRleC50c1BLAwQUAAAACABKX2dXAAAAAAAAAAAAAAAAFQAAAHBsYXlncm9undvZWRpdG9yL1BLAwQUAAAACABKX2dXAAAAAAAAAAAAAAAAHwAAAHBsYXlncm91bmQvZWRpdG9yL0Jsb2NrbHlFZGl0b3IudHNQSwMEFAAAAAgASl9nVwAAAAAAAAAAAAAAABoAAABwbGF5Z3JvdW5kL2VkaXRvci9pbmRleC50c1BLAwQUAAAACABKX2dXAAAAAAAAAAAAAAAAFAAAAHBsYXlncm91bmQvcnVubmVyL1BLAwQUAAAACABKX2dXAAAAAAAAAAAAAAAAHAAAAHBsYXlncm91bmQvcnVubmVyL0NvZGVFeGVjdXRvci50c1BLAwQUAAAACABKX2dXAAAAAAAAAAAAAAAAGQAAAHBsYXlncm91bmQvcnVubmVyL2luZGV4LnRzUEsDBBQAAAAIAEpfZ1cAAAAAAAAAAAAAAAAPAAAAY29udGVudC9pbmRleC50c1BLAwQUAAAACABKX2dXAAAAAAAAAAAAAAAAFAAAAGNvbnRlbnQvY3VycmljdWx1bS9QSwMEFAAAAAgASl9nVwAAAAAAAAAAAAAAAB4AAABjb250ZW50L2N1cnJpY3VsdW0vQ3VycmljdWx1bU1hbmFnZXIudHNQSwMEFAAAAAgASl9nVwAAAAAAAAAAAAAAABkAAABjb250ZW50L2N1cnJpY3VsdW0vaW5kZXgudHNQSwMEFAAAAAgASl9nVwAAAAAAAAAAAAAAABUAAABjb250ZW50L2NoYWxsZW5nZXMvUEsDBBQAAAAIAEpfZ1cAAAAAAAAAAAAAAAAbAAAAY29udGVudC9jaGFsbGVuZ2VzL0NoYWxsZW5nZS50c1BLAwQUAAAACABKX2dXAAAAAAAAAAAAAAAAGgAAAGNvbnRlbnQvY2hhbGxlbmdlcy9pbmRleC50c1BLAwQUAAAACABKX2dXAAAAAAAAAAAAAAAAFAAAAGNvbnRlbnQvdGVtcGxhdGVzL1BLAwQUAAAACABKX2dXAAAAAAAAAAAAAAAAGgAAAGNvbnRlbnQvdGVtcGxhdGVzL0xlc3Nvbi50c1BLAwQUAAAACABKX2dXAAAAAAAAAAAAAAAAGQAAAGNvbnRlbnQvdGVtcGxhdGVzL2luZGV4LnRzUEsDBBQAAAAIAEpfZ1cAAAAAAAAAAAAAAAAKAAAAdWkvaW5kZXgudHNQSwMEFAAAAAgASl9nVwAAAAAAAAAAAAAAAA8AAAB1aS9jb21wb25lbnRzL1BLAwQUAAAACABKX2dXAAAAAAAAAAAAAAAAHwAAAHVpL2NvbXBvbmVudHMvUGxheWdyb3VuZEVkaXRvci50c3hQSwMEFAAAAAgASl9nVwAAAAAAAAAAAAAAAB8AAAB1aS9jb21wb25lbnRzL0hhcmR3YXJlUnVubmVyLnRzeFBLAwQUAAAACABKX2dXAAAAAAAAAAAAAAAAFAAAAHVpL2NvbXBvbmVudHMvaW5kZXgudHNQSwMEFAAAAAgASl9nVwAAAAAAAAAAAAAAAAsAAAB1aS9ob29rcy9QSwMEFAAAAAgASl9nVwAAAAAAAAAAAAAAABwAAAB1aS9ob29rcy91c2VQbGF5Z3JvdW5kRW5naW5lLnRzUEsDBBQAAAAIAEpfZ1cAAAAAAAAAAAAAAAAQAAAAdWkvaG9va3MvaW5kZXgudHNQSwMEFAAAAAgASl9nVwAAAAAAAAAAAAAAAAwAAABzZXJ2aWNlcy9QSwMEFAAAAAgASl9nVwAAAAAAAAAAAAAAABEAAABzZXJ2aWNlcy9pbmRleC50c1BLAwQUAAAACABKX2dXAAAAAAAAAAAAAAAAEQAAAHNlcnZpY2VzL3N0b3JhZ2UvUEsDBBQAAAAIAEpfZ1cAAAAAAAAAAAAAAAAdAAAAc2VydmljZXMvc3RvcmFnZS9Db25maWdTdG9yYWdlLnRzUEsDBBQAAAAIAEpfZ1cAAAAAAAAAAAAAAAAWAAAAc2VydmljZXMvc3RvcmFnZS9pbmRleC50c1BLAwQUAAAACABKX2dXAAAAAAAAAAAAAAAADwAAAHNlcnZpY2VzL2FwaS9QSwMEFAAAAAgASl9nVwAAAAAAAAAAAAAAABQAAABzZXJ2aWNlcy9hcGkvaW5kZXgudHNQSwMEFAAAAAgASl9nVwAAAAAAAAAAAAAAAAcAAABjb25maWcvUEsDBBQAAAAIAEpfZ1cAAAAAAAAAAAAAAAANAAAAY29uZmlnL2Jhc2UudHNQSwMEFAAAAAgASl9nVwAAAAAAAAAAAAAAAAwAAABhcHBsaWNhdGlvbi9QSwMEFAAAAAgASl9nVwAAAAAAAAAAAAAAABEAAABhcHBsaWNhdGlvbi9pbmRleC50c1BLAwQUAAAACABKX2dXAAAAAAAAAAAAAAAAFgAAAGFwcGxpY2F0aW9uL0FwcGxpY2F0aW9uLnRzUEsDBBQAAAAIAEpfZ1cAAAAAAAAAAAAAAAAJAAAAUkVBRE1FLm1k
"""

def write_file(path, content):
    """Write content to a file, creating directories if needed."""
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding='utf-8')

def create_project_files(project_dir: Path):
    """Create additional necessary project files."""
    print("📄 Creating additional project files...")

    # tsconfig.json
    write_file(project_dir / "tsconfig.json", '''{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "jsx": "react",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "resolveJsonModule": true
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}
''')

    # package.json
    write_file(project_dir / "package.json", '''{
  "name": "hardware-playground-refactored",
  "version": "1.0.0",
  "description": "A refactored, modular hardware playground platform.",
  "main": "dist/application/index.js",
  "scripts": {
    "start": "node dist/application/index.js",
    "dev": "tsc-watch --onSuccess \\"node dist/application/index.js\\"",
    "build": "tsc",
    "test": "jest",
    "lint": "eslint src/**/*.ts"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/jest": "^29.5.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "eslint": "^8.50.0",
    "jest": "^29.5.0",
    "ts-jest": "^29.1.0",
    "ts-node": "^10.9.0",
    "tsc-watch": "^6.0.4",
    "typescript": "^5.0.0"
  }
}
''')

    # README.md
    write_file(project_dir / "README.md", '''# Hardware Playground - Refactored
A clean, modular, and extensible platform for visual programming and hardware control education.
''')

    # .gitignore
    write_file(project_dir / ".gitignore", '''
node_modules
dist
.DS_Store
''')

def main():
    """Main function to decode and create project structure."""
    project_dir = Path("./hardware-playground-refactored")
    print(f"🚀 Decoding project into: {project_dir}")

    # Decode the base64 data
    data_without_newlines = "".join(PROJECT_DATA.split())
    padded_data = data_without_newlines + '=' * (-len(data_without_newlines) % 4)
    zip_data = base64.b64decode(padded_data)
    zip_file = zipfile.ZipFile(io.BytesIO(zip_data))

    # Extract all files
    zip_file.extractall(project_dir / "src")

    print("✨ Project structure decoded successfully!")

    # Create additional project files
    create_project_files(project_dir)
    print("📁 All project files created successfully!")

if __name__ == "__main__":
    main()
