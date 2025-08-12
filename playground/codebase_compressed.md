# Codebase for Refactoring

**Total files:** 60

## blockgenrator\config\neoPixelConfig.ts

**Size:** 1202 bytes  
**Language:** typescript

```typescript
import {TemplateConfig,generateControllerFile} from "../generators/SimHwControllerCodeGenerator";
import {Direction} from "@/features/playground/components/simulated-hardwares/modules/neopixel-display/types";

export const neoPixelConfig: TemplateConfig = {
    componentName: 'neoPixel',
    filePath: 'src/module/playground/components/simulated-hardwares/neopixel-display/neoPixelController.ts',
    componentKey: 'NEO_PIXEL_MATRIX',
    controllerData: [
        {funcName: "moveUp", payload: {direction: Direction.Up},delay:200},
        {funcName: "moveDown", payload: {direction: 'Direction.Down'},delay:0},
        {funcName: "moveLeft", payload: {direction: 'Direction.Left'},delay:200},
        {funcName: "moveRight", payload: {direction: 'Direction.Right'},delay:200},
        {funcName: "moveTopLeft", payload: {direction: 'Direction.TopLeft'},delay:200},
        {funcName: "moveTopRight", payload: {direction: 'Direction.TopRight'},delay:200},
        {funcName: "moveBottomLeft", payload: {direction: 'Direction.BottomLeft'},delay:200},
        {funcName: "moveBottomRight", payload: {direction: 'Direction.BottomRight'},delay:200},
    ],
};

generateControllerFile(neoPixelConfig);




```

## blockgenrator\generators\SimHwControllerCodeGenerator.ts

**Size:** 1884 bytes  
**Language:** typescript

```typescript
// template.ts
import * as fs from 'fs';


export interface TemplateConfig {
    componentName: string;
    componentKey: string;
    filePath: string;
    controllerData: ControllerData[];
}

export interface ControllerData {
    funcName: string;
    payload: any;
    delay:number
}

export function generateControllerFile(config: TemplateConfig): void {
    const { componentName, componentKey, controllerData} = config;

    const content = controllerData.map((data) => `
    ${data.funcName}: () => getChannelMessageWithDelay('${componentKey}', ${JSON.stringify(data.payload)},${data.delay}),
`).join("");

    const template = `
import { getChannelMessage, getChannelMessageWithDelay } from "@/utils/pg-comm-channel.util";

const ${componentName}Controller = {
${content}
};

export default ${componentName}Controller;
`;

    fs.writeFileSync(`${componentName}Controller.ts`, template);
}


const neoPixelConfig: TemplateConfig = {
    componentName: 'neoPixel',
    filePath: 'src/module/playground/components/simulated-hardwares/neopixel-display/neoPixelController.ts',
    componentKey: 'NEO_PIXEL_MATRIX',
    controllerData: [
        {funcName: "moveUp", payload: {direction: 'Direction.Up'},delay:200},
        {funcName: "moveDown", payload: {direction: 'Direction.Down'},delay:0},
        {funcName: "moveLeft", payload: {direction: 'Direction.Left'},delay:200},
        {funcName: "moveRight", payload: {direction: 'Direction.Right'},delay:200},
        {funcName: "moveTopLeft", payload: {direction: 'Direction.TopLeft'},delay:200},
        {funcName: "moveTopRight", payload: {direction: 'Direction.TopRight'},delay:200},
        {funcName: "moveBottomLeft", payload: {direction: 'Direction.BottomLeft'},delay:200},
        {funcName: "moveBottomRight", payload: {direction: 'Direction.BottomRight'},delay:200},
    ],
};

generateControllerFile(neoPixelConfig);


```

## compressor.py

**Size:** 15116 bytes  
**Language:** python

```python
#!/usr/bin/env python3
"""
Code Compressor CLI Tool
Compresses codebases for AI-assisted refactoring and optimization.
"""

import os
import sys
import argparse
import fnmatch
from pathlib import Path
import json
from typing import List, Dict, Set, Optional
import zipfile
import tempfile
import shutil

class CodeCompressor:
    def __init__(self):
        # Common code file extensions
        self.code_extensions = {
            '.py', '.js', '.jsx', '.ts', '.tsx', '.java', '.cpp', '.c', '.h', '.hpp',
            '.cs', '.php', '.rb', '.go', '.rs', '.swift', '.kt', '.scala', '.r',
            '.m', '.mm', '.pl', '.sh', '.bash', '.zsh', '.fish', '.ps1', '.bat',
            '.html', '.htm', '.css', '.scss', '.sass', '.less', '.vue', '.svelte',
            '.sql', '.graphql', '.gql', '.yaml', '.yml', '.json', '.xml', '.toml',
            '.ini', '.cfg', '.conf', '.env', '.dockerfile', '.makefile', '.cmake',
            '.gradle', '.maven', '.sbt', '.clj', '.cljs', '.elm', '.hs', '.ml',
            '.fs', '.ex', '.exs', '.erl', '.hrl', '.lua', '.dart', '.nim'
        }
        
        # Files and directories to ignore by default
        self.default_ignore_patterns = {
            # Version control
            '.git', '.svn', '.hg', '.bzr',
            # Dependencies
            'node_modules', 'venv', 'env', '.env', 'vendor', '__pycache__',
            '.pytest_cache', '.mypy_cache', '.tox', 'site-packages',
            # Build outputs
            'build', 'dist', 'out', 'target', 'bin', 'obj', '.gradle',
            # IDE files
            '.vscode', '.idea', '.eclipse', '*.swp', '*.swo', '*~',
            # OS files
            '.DS_Store', 'Thumbs.db', 'desktop.ini',
            # Logs and temp
            '*.log', '*.tmp', '*.temp', '.cache'
        }

    def should_ignore(self, path: Path, ignore_patterns: Set[str]) -> bool:
        """Check if a path should be ignored based on patterns."""
        path_str = str(path)
        name = path.name
        
        for pattern in ignore_patterns:
            if fnmatch.fnmatch(name, pattern) or fnmatch.fnmatch(path_str, pattern):
                return True
        return False

    def is_code_file(self, file_path: Path, custom_extensions: Optional[Set[str]] = None) -> bool:
        """Check if a file is a code file based on extension."""
        extensions = custom_extensions or self.code_extensions
        return file_path.suffix.lower() in extensions or file_path.name.lower() in {'makefile', 'dockerfile', 'rakefile'}

    def get_file_info(self, file_path: Path) -> Dict:
        """Get metadata about a file."""
        try:
            stat = file_path.stat()
            return {
                'size': stat.st_size,
                'modified': stat.st_mtime,
                'extension': file_path.suffix.lower()
            }
        except (OSError, IOError):
            return {'size': 0, 'modified': 0, 'extension': ''}

    def collect_code_files(self, root_path: Path, ignore_patterns: Set[str], 
                          custom_extensions: Optional[Set[str]] = None) -> List[Path]:
        """Recursively collect all code files from the given path."""
        code_files = []
        
        for item in root_path.rglob('*'):
            if item.is_file():
                # Skip ignored files/directories
                if self.should_ignore(item, ignore_patterns):
                    continue
                
                # Check if any parent directory should be ignored
                if any(self.should_ignore(parent, ignore_patterns) for parent in item.parents):
                    continue
                
                # Check if it's a code file
                if self.is_code_file(item, custom_extensions):
                    code_files.append(item)
        
        return sorted(code_files)

    def format_for_ai(self, files_data: List[Dict], output_format: str) -> str:
        """Format the collected code for AI processing."""
        if output_format == 'json':
            return json.dumps(files_data, indent=2, ensure_ascii=False)
        
        elif output_format == 'markdown':
            content = "# Codebase for Refactoring\n\n"
            content += f"**Total files:** {len(files_data)}\n\n"
            
            for file_data in files_data:
                content += f"## {file_data['path']}\n\n"
                content += f"**Size:** {file_data['size']} bytes  \n"
                content += f"**Language:** {file_data['language']}\n\n"
                content += f"```{file_data['language']}\n"
                content += file_data['content']
                content += "\n```\n\n"
            
            return content
        
        elif output_format == 'plain':
            content = f"=== CODEBASE ANALYSIS ({len(files_data)} files) ===\n\n"
            
            for file_data in files_data:
                content += f"=== FILE: {file_data['path']} ===\n"
                content += f"Language: {file_data['language']}\n"
                content += f"Size: {file_data['size']} bytes\n"
                content += "Content:\n"
                content += file_data['content']
                content += "\n\n"
            
            return content

    def detect_language(self, file_path: Path) -> str:
        """Detect the programming language based on file extension."""
        ext = file_path.suffix.lower()
        name = file_path.name.lower()
        
        language_map = {
            '.py': 'python',
            '.js': 'javascript',
            '.jsx': 'javascript',
            '.ts': 'typescript',
            '.tsx': 'typescript',
            '.java': 'java',
            '.cpp': 'cpp',
            '.c': 'c',
            '.h': 'c',
            '.hpp': 'cpp',
            '.cs': 'csharp',
            '.php': 'php',
            '.rb': 'ruby',
            '.go': 'go',
            '.rs': 'rust',
            '.swift': 'swift',
            '.kt': 'kotlin',
            '.scala': 'scala',
            '.r': 'r',
            '.m': 'objective-c',
            '.mm': 'objective-c',
            '.pl': 'perl',
            '.sh': 'bash',
            '.bash': 'bash',
            '.zsh': 'zsh',
            '.fish': 'fish',
            '.ps1': 'powershell',
            '.bat': 'batch',
            '.html': 'html',
            '.htm': 'html',
            '.css': 'css',
            '.scss': 'scss',
            '.sass': 'sass',
            '.less': 'less',
            '.vue': 'vue',
            '.svelte': 'svelte',
            '.sql': 'sql',
            '.graphql': 'graphql',
            '.gql': 'graphql',
            '.yaml': 'yaml',
            '.yml': 'yaml',
            '.json': 'json',
            '.xml': 'xml',
            '.toml': 'toml',
            '.dockerfile': 'dockerfile',
        }
        
        if name in ['makefile', 'rakefile']:
            return 'makefile'
        elif name == 'dockerfile':
            return 'dockerfile'
        
        return language_map.get(ext, 'text')

    def compress_codebase(self, root_path: Path, output_path: Optional[Path] = None,
                         ignore_patterns: Optional[Set[str]] = None,
                         output_format: str = 'markdown',
                         max_file_size: int = 1024 * 1024,  # 1MB default
                         custom_extensions: Optional[Set[str]] = None,
                         create_zip: bool = False) -> str:
        """Main method to compress a codebase."""
        
        if ignore_patterns is None:
            ignore_patterns = self.default_ignore_patterns.copy()
        
        print(f"🔍 Scanning codebase in: {root_path}")
        
        # Collect all code files
        code_files = self.collect_code_files(root_path, ignore_patterns, custom_extensions)
        
        if not code_files:
            print("❌ No code files found!")
            return ""
        
        print(f"📁 Found {len(code_files)} code files")
        
        # Process files
        files_data = []
        total_size = 0
        skipped_files = []
        
        for file_path in code_files:
            try:
                file_info = self.get_file_info(file_path)
                
                # Skip very large files
                if file_info['size'] > max_file_size:
                    skipped_files.append((str(file_path.relative_to(root_path)), file_info['size']))
                    continue
                
                # Read file content
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                except UnicodeDecodeError:
                    # Try with different encodings
                    for encoding in ['latin-1', 'cp1252', 'iso-8859-1']:
                        try:
                            with open(file_path, 'r', encoding=encoding) as f:
                                content = f.read()
                            break
                        except UnicodeDecodeError:
                            continue
                    else:
                        content = f"[Binary file - could not decode: {file_path.name}]"
                
                relative_path = str(file_path.relative_to(root_path))
                language = self.detect_language(file_path)
                
                files_data.append({
                    'path': relative_path,
                    'language': language,
                    'size': len(content),
                    'content': content
                })
                
                total_size += len(content)
                
            except Exception as e:
                print(f"⚠️  Error processing {file_path}: {e}")
                continue
        
        # Print summary
        print(f"✅ Processed {len(files_data)} files")
        print(f"📊 Total size: {total_size:,} characters")
        
        if skipped_files:
            print(f"⏭️  Skipped {len(skipped_files)} large files:")
            for file_path, size in skipped_files:
                print(f"   - {file_path} ({size:,} bytes)")
        
        # Format output
        formatted_content = self.format_for_ai(files_data, output_format)
        
        # Save to file
        if output_path:
            output_path.write_text(formatted_content, encoding='utf-8')
            print(f"💾 Saved to: {output_path}")
            
            # Create zip if requested
            if create_zip:
                zip_path = output_path.with_suffix('.zip')
                with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
                    zf.writestr(output_path.name, formatted_content)
                print(f"📦 Created zip: {zip_path}")
        
        return formatted_content

def main():
    parser = argparse.ArgumentParser(
        description="Compress codebase for AI-assisted refactoring",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s /path/to/project                    # Basic compression
  %(prog)s . -o output.md                      # Compress current dir to file
  %(prog)s /project --format json             # Output as JSON
  %(prog)s /project --ignore "*.test.js"      # Add custom ignore patterns
  %(prog)s /project --extensions .py,.js      # Only include specific extensions
  %(prog)s /project --max-size 500000 --zip   # Limit file size and create zip
        """
    )
    
    parser.add_argument('path', help='Path to the codebase directory')
    parser.add_argument('-o', '--output', help='Output file path')
    parser.add_argument('--format', choices=['markdown', 'json', 'plain'], 
                       default='markdown', help='Output format (default: markdown)')
    parser.add_argument('--ignore', action='append', default=[],
                       help='Additional ignore patterns (can be used multiple times)')
    parser.add_argument('--extensions', help='Comma-separated list of file extensions to include')
    parser.add_argument('--max-size', type=int, default=1024*1024,
                       help='Maximum file size in bytes (default: 1MB)')
    parser.add_argument('--zip', action='store_true',
                       help='Also create a zip file with the output')
    parser.add_argument('--list-files', action='store_true',
                       help='Only list files that would be processed, don\'t compress')
    
    args = parser.parse_args()
    
    # Validate input path
    root_path = Path(args.path).resolve()
    if not root_path.exists():
        print(f"❌ Error: Path '{args.path}' does not exist")
        sys.exit(1)
    
    if not root_path.is_dir():
        print(f"❌ Error: Path '{args.path}' is not a directory")
        sys.exit(1)
    
    # Setup compressor
    compressor = CodeCompressor()
    
    # Handle ignore patterns
    ignore_patterns = compressor.default_ignore_patterns.copy()
    ignore_patterns.update(args.ignore)
    
    # Handle custom extensions
    custom_extensions = None
    if args.extensions:
        custom_extensions = set()
        for ext in args.extensions.split(','):
            ext = ext.strip()
            if not ext.startswith('.'):
                ext = '.' + ext
            custom_extensions.add(ext.lower())
    
    # Handle output path
    output_path = None
    if args.output:
        output_path = Path(args.output)
    elif not args.list_files:
        # Default output filename
        format_ext = {'markdown': '.md', 'json': '.json', 'plain': '.txt'}
        default_name = f"codebase_compressed{format_ext[args.format]}"
        output_path = Path.cwd() / default_name
    
    if args.list_files:
        # Just list files
        code_files = compressor.collect_code_files(root_path, ignore_patterns, custom_extensions)
        print(f"Found {len(code_files)} code files:")
        for file_path in code_files:
            rel_path = file_path.relative_to(root_path)
            file_info = compressor.get_file_info(file_path)
            print(f"  {rel_path} ({file_info['size']:,} bytes)")
    else:
        # Compress codebase
        try:
            content = compressor.compress_codebase(
                root_path=root_path,
                output_path=output_path,
                ignore_patterns=ignore_patterns,
                output_format=args.format,
                max_file_size=args.max_size,
                custom_extensions=custom_extensions,
                create_zip=args.zip
            )
            
            if not content:
                sys.exit(1)
            
            print("\n🎉 Compression complete!")
            print("\nNext steps:")
            print("1. Copy the generated file content")
            print("2. Paste it to Claude or another AI assistant")
            print("3. Ask for refactoring suggestions, code reviews, or optimizations")
            
        except KeyboardInterrupt:
            print("\n❌ Cancelled by user")
            sys.exit(1)
        except Exception as e:
            print(f"❌ Error: {e}")
            sys.exit(1)

if __name__ == "__main__":
    main()
```

## ContentPage.tsx

**Size:** 5519 bytes  
**Language:** typescript

```typescript
import Link from 'next/link';
import {FC, Key} from "react";
import {Button} from "@/features/common/components/button/Button";

interface Content {
    state: any
}

export const ContentPage: FC<Content> = ({state}) => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">

            {/* Main Content */}
            <main className="flex-grow mt-16 md:mt-20">
                <div className="container mx-auto px-4 py-8 md:flex">
                    {/* Article Content */}
                    <article className="ml-40 mr-20 md:w-screen md:pr-8">
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
                            {state.content.title}
                        </h1>
                        <h2 className="text-xl md:text-2xl text-gray-600 mb-6">
                            {state.content.description}
                        </h2>
                        <div className="prose prose-lg max-w-none">
                            <img
                                src={state.content.media.image.url}
                                alt=""
                                className="w-[600px] h-[200px] object-cover rounded-lg shadow-md mb-6"
                            />

                            {/* Render the Section components dynamically */}
                            {state.content.articleSections.map((section: {
                                title: string;
                                content: string;
                                imageUrl:string
                            }, index: Key | null | undefined) => (
                                <Section key={index} title={section.title} content={section.content} imageUrl={section.imageUrl}/>
                            ))}

                            {
                                ((state.hwPlaygroundConfigId !== '-1')) ?

                                    <div className="my-5">
                                        <Link href={`/playground/${state.hwPlaygroundConfigId}`}>
                                            <Button uiType="primary">
                                                Run in playground
                                            </Button>
                                            <span className="sr-only">Go to Playground</span>
                                        </Link>
                                    </div>:<div/>
                            }


                            {/*/!* Video Embed *!/*/}
                            {/*<div className="aspect-w-16 aspect-h-9 my-8">*/}
                            {/*    <iframe*/}
                            {/*        src="https://www.youtube.com/embed/dQw4w9WgXcQ"*/}
                            {/*        frameBorder="0"*/}
                            {/*        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"*/}
                            {/*        allowFullScreen*/}
                            {/*        className="rounded-lg shadow-md"*/}
                            {/*    ></iframe>*/}
                            {/*</div>*/}
                        </div>
                    </article>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-between">
                        <div className="w-full md:w-1/3 mb-6 md:mb-0">
                            <h5 className="text-lg font-semibold mb-4">About Us</h5>
                            <p className="text-gray-400">
                                We are passionate about sharing knowledge and insights on web development trends and best practices.
                            </p>
                        </div>
                        <div className="w-full md:w-1/3 mb-6 md:mb-0">
                            <h5 className="text-lg font-semibold mb-4">Quick Links</h5>
                            <ul className="space-y-2">
                                <li><Link href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                                <li><Link href="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
                                <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact Us</Link></li>
                            </ul>
                        </div>
                        <div className="w-full md:w-1/3">
                            <h5 className="text-lg font-semibold mb-4">Follow Us</h5>
                            <div className="flex space-x-4">
                                {/* Add social media icons here */}
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default ContentPage;

interface SectionProps {
    title: string;
    content: string;
    imageUrl:string
}

const Section = ({ title, content,imageUrl }: SectionProps) => (
    <div className="mt-8">
        <h3 className="text-2xl font-serif font-semibold mb-4">{title}</h3>
        <p className={'mb-5'}>{content}</p>
        {(imageUrl)? <img
            src={imageUrl}
            alt=""
            className="w-[600px] h-[200px] object-cover rounded-lg shadow-md mb-6"
            />:<div/>
        }
    </div>
);


```

## hardwareplayground\playground.ts

**Size:** 2628 bytes  
**Language:** typescript

```typescript
import * as Blockly from 'blockly';
import {pythonGenerator} from 'blockly/python';
import {javascriptGenerator} from 'blockly/javascript';
import {save, load} from './workspace/serialization';
import {blocks, forJsBlock,forPyBlock} from "./workspace/blocks/blocks";
import {blocklyOptions, BlocklyTheme} from './workspace/elgotheme';
import {connectSerial, sendCodeToDevice} from "./webserial/webserial";
import {getCodeCompletionCallback, initPlaygroundCommunication} from "@/utils/pg-comm-channel.util";
import {Direction} from "@/features/playground/components/simulated-hardwares/modules/neopixel-display/types";

initBlockly();

export class Playground {
    private workspace: Blockly.WorkspaceSvg;

    constructor(div: HTMLElement, toolbox: Element | any) {
        initPlaygroundCommunication();

        this.workspace = Blockly.inject(div, {
            toolbox: toolbox,
            theme: BlocklyTheme,
            ...blocklyOptions
        });

        const state = Blockly.serialization.workspaces.save(this.workspace);
        Blockly.serialization.workspaces.load(state, this.workspace);
        // load(this.workspace);
    }

    getAsyncCodeWithPredefinedFunctions(blockCode: string): string {
        const codePrefix = `
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));\n\n
        const executeTimeouts = async () => {
        await delay(500);
        \n`
        const codePostfix = `\n
        await delay(500);\n
        handleCodeCompletion();\n }; \n
        return executeTimeouts();`
        let code = codePrefix + blockCode + codePostfix
        console.log(code)
        return code;

    }

    async connectToDevice(onDisconnect:()=>void){
        return connectSerial(onDisconnect)
    }



    getJsCode(): string {
        let code = javascriptGenerator.workspaceToCode(this.workspace);
        code = this.getAsyncCodeWithPredefinedFunctions(code);
        return code
    }

    generateExecJsCode() {
        // eval(code)
        this.executeJsCode(this.getJsCode())

    }

    executeJsCode(code: string, arg1 = 0, arg2 = 0, arg3 = 0, arg4 = 0, arg5 = 0): number {
        const something = new Function('arg1', 'arg2', 'arg3', 'arg4', 'arg5', code);
        return something(arg1, arg2, arg3, arg4, arg5);
    }

    generateExecPyCode(): void {
        const code = pythonGenerator.workspaceToCode(this.workspace);
        sendCodeToDevice(code);
    }

}

function initBlockly(): void {
    Blockly.common.defineBlocks(blocks);
    Object.assign(pythonGenerator.forBlock, forPyBlock);
    Object.assign(javascriptGenerator.forBlock, forJsBlock);
}

```

## hardwareplayground\webserial\webserial.ts

**Size:** 3322 bytes  
**Language:** typescript

```typescript
let port: SerialPort | undefined,
    textEncoder: TextEncoderStream | undefined,
    writableStreamClosed: Promise<void> | undefined,
    writer: WritableStreamDefaultWriter<string> | undefined;

export async function connectSerial(onDisconnect: () => void): Promise<boolean> {
    try {
        port = await navigator.serial.requestPort();
        await port.open({baudRate: 115200});
        
        if (!port.writable) {
            throw new Error("Port writable stream is not available");
        }
        
        textEncoder = new TextEncoderStream();
        writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
        writer = textEncoder.writable.getWriter();
        port.addEventListener('disconnect', () => {
            onDisconnect();
        });
        listenToPort().then(result => {
            return true
        });
        return true
    } catch (e) {
        alert("Serial Connection Failed" + e);
        return false;
    }
}



export async function areDevicesConnected(): Promise<boolean> {
    try {
        console.log('devices!!')
        const ports = await navigator.serial.getPorts();
        console.log(ports,ports.length !== 0)
        return ports.length !== 0;
    } catch (error) {
        console.error("Error checking connected devices:", error);
        return false;
    }
}

function convertCodeToByteString(pythonCode: string): string {
    let byteArray = new TextEncoder().encode(pythonCode);
    return byteArray.join(', ');
}

function sendSerialData(executableCommands: string): void {
    if (writer) {
        writer.write(executableCommands);
    }
}

export function sendCodeToDevice(pythonCode: string): void {
    const byteString = convertCodeToByteString(pythonCode);
    const executableCommands = buildExecutableCommand(byteString);
    sendSerialData(executableCommands);
}

function buildExecutableCommand(byteCodeString: string): string {
    let createFile = "f=open('code.py','w');\r"
    let createBinaryArray = `byteArray = [${byteCodeString}];\r`
    let createByteString = "codeString = ''.join(chr(i) for i in byteArray);\r"
    let printFile = "print(open('code.py').read());\r"
    let writeFile = `f.write(codeString);\r`
    let closeFile = "f.close();\r"
    let execFile = "exec(open('code.py').read(),globals());\r"
    // let listdir = "import os; os.listdir('.');\r";

    const executableCommands =
        createFile +
        createBinaryArray +
        createByteString +
        writeFile +
        printFile +
        closeFile +
        execFile

    return executableCommands;
}


async function listenToPort(): Promise<void> {
    if (!port || !port.readable) {
        return;
    }
    const textDecoder = new TextDecoderStream();
    const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
    const reader = textDecoder.readable.getReader();

    // Listen to data coming from the serial device.
    while (true) {
        try {
            const {value, done} = await reader.read();
            if (done) {
                console.log('[readLoop] DONE', done);
                reader.releaseLock();
                break;
            }
            console.log(value + '\n');
        } catch (error) {
            console.error('[readLoop] ERROR', error);
            break;
        }
    }
}

```

## hardwareplayground\workspace\blocks\blockKeys.ts

**Size:** 2972 bytes  
**Language:** typescript

```typescript
const blockKeys = {


    //--------------------core blocks--------------------

    // Logic category
    controlsIf: 'controls_if',
    logicCompare: 'logic_compare',
    logicOperation: 'logic_operation',
    logicNegate: 'logic_negate',
    logicBoolean: 'logic_boolean',
    logicNull: 'logic_null',
    logicTernary: 'logic_ternary',

    // Loops category
    controlsRepeatExt: 'controls_repeat_ext',
    controlsRepeat: 'controls_repeat',
    controlsWhileUntil: 'controls_whileUntil',
    controlsFor: 'controls_for',
    controlsForEach: 'controls_forEach',
    controlsFlowStatements: 'controls_flow_statements',

    // Math category
    mathNumber: 'math_number',
    mathArithmetic: 'math_arithmetic',
    mathSingle: 'math_single',
    mathTrig: 'math_trig',
    mathConstant: 'math_constant',
    mathNumberProperty: 'math_number_property',
    mathRound: 'math_round',
    mathOnList: 'math_on_list',
    mathModulo: 'math_modulo',
    mathConstrain: 'math_constrain',
    mathRandomInt: 'math_random_int',
    mathRandomFloat: 'math_random_float',
    mathAtan2: 'math_atan2',

    // Text category
    text: 'text',
    textMultiline: 'text_multiline',
    textJoin: 'text_join',
    textAppend: 'text_append',
    textLength: 'text_length',
    textIsEmpty: 'text_isEmpty',
    textIndexOf: 'text_indexOf',
    textCharAt: 'text_charAt',
    textGetSubstring: 'text_getSubstring',
    textChangeCase: 'text_changeCase',
    textTrim: 'text_trim',
    textCount: 'text_count',
    textReplace: 'text_replace',
    textReverse: 'text_reverse',
    textPrint: 'text_print',
    textPromptExt: 'text_prompt_ext',

    // Lists category
    listsCreateWith: 'lists_create_with',
    listsRepeat: 'lists_repeat',
    listsLength: 'lists_length',
    listsIsEmpty: 'lists_isEmpty',
    listsIndexOf: 'lists_indexOf',
    listsGetIndex: 'lists_getIndex',
    listsSetIndex: 'lists_setIndex',
    listsGetSublist: 'lists_getSublist',
    listsSplit: 'lists_split',
    listsSort: 'lists_sort',
    listsReverse: 'lists_reverse',

    // Colour category
    colourPicker: 'colour_picker',
    colourRandom: 'colour_random',
    colourRgb: 'colour_rgb',
    colourBlend: 'colour_blend',

    //--------------------custom blocks--------------------

    //neo-pixel-matrix
    moveUp: 'moveUp',
    moveDown: 'moveDown',
    moveRight: 'moveRight',
    moveLeft: 'moveLeft',
    moveTopLeft: 'moveTopLeft',
    moveTopRight: 'moveTopRight',
    moveBottomLeft: 'moveBottomLeft',
    moveBottomRight: 'moveBottomRight',
    //Led
    turnOnLed: 'turnOnLed',
    turnOffLed: 'turnOffLed',
    blinkLed: 'blinkLed',
    //servo motor
    turnServoLeft: 'turnServoLeft',
    turnServoRight: 'turnServoRight',

    //buzzer
    turnOnBuzzer:'turnOnBuzzer',
    turnOffBuzzer:'turnOffBuzzer',

    //light-buzzer
    lightBuzzerOnStart : 'light_buzzer_on_start',

    //inputs
    lightValue: 'lightValue',

    //delay
    delay :'delay'


}

export default blockKeys;
```

## hardwareplayground\workspace\blocks\blocks.ts

**Size:** 3476 bytes  
**Language:** typescript

```typescript
import * as Blockly from 'blockly/core';
import { Block, Generator } from 'blockly/core';

import blockKeys from "@/utils/playground/workspace/blocks/blockKeys";


import neopixelBlockConfig
    from "@/features/playground/components/simulated-hardwares/modules/neopixel-display/neopixelBlockConfig";
import ledModuleBlockConfig
    from "@/features/playground/components/simulated-hardwares/modules/led/ledModuleBlockConfig";
import buzzerBlockConfig
    from "@/features/playground/components/simulated-hardwares/modules/buzzer/buzzerModuleBlockConfig";
import servoBlockConfig
    from "@/features/playground/components/simulated-hardwares/modules/servo-motor/servoModuleBlockConfig";
import inputsBlockConfig from "@/utils/playground/workspace/toolbox/core/inputs/inputsBlockConfig";

import delayBlockConfig from "@/features/playground/components/simulated-hardwares/modules/common/delayBlockConfig";

interface BlockConfig {
    blockDefinitions?: { [key: string]: any };
    jsCodeGenerator?: { [key: string]: (block: Block, generator: Generator) => any };
    pyCodeGenerator?: { [key: string]: (block: Block, generator: Generator) => any };
    toolBox?: any[];
    [key: string]: any; // Allow additional properties
}


const testBlock = {'type': 'test_block', 'message0': 'example block', 'colour': 160, 'tooltip': '', 'helpUrl': '',};
const blockDefinitionsArray: any[] = [testBlock]


export const blockConfigs: BlockConfig[] = [neopixelBlockConfig, ledModuleBlockConfig, buzzerBlockConfig, servoBlockConfig, inputsBlockConfig,delayBlockConfig]

export const forJsBlock: { [key: string]: (block: Block, generator: Generator) => any } = Object.create(null);
export const forPyBlock: { [key: string]: (block: Block, generator: Generator) => any } = Object.create(null);
const JS_GENERATOR = 'jsCodeGenerator'
const PY_GENERATOR = 'pyCodeGenerator'



for (let key in blockKeys) {
    if (blockKeys.hasOwnProperty(key)) {
        blockConfigs.forEach((blockConfig) => {

            if (blockConfig.blockDefinitions && blockConfig.blockDefinitions.hasOwnProperty(key)) {
                blockDefinitionsArray.push(blockConfig.blockDefinitions[key])
            }

            if (blockConfig.hasOwnProperty(JS_GENERATOR)){
                if (blockConfig.jsCodeGenerator && blockConfig.jsCodeGenerator.hasOwnProperty(key)) {
                    forJsBlock[key] = (blocks, generator) => blockConfig.jsCodeGenerator![key](blocks, generator);
                }
            }
            if (blockConfig.hasOwnProperty(PY_GENERATOR)){
                if (blockConfig.pyCodeGenerator && blockConfig.pyCodeGenerator.hasOwnProperty(key)) {
                    forPyBlock[key] = (blocks, generator) => blockConfig.pyCodeGenerator![key](blocks, generator);
                }
            }


        })
    }
}


export function getSimpleToolboxBlock(blockKey: string) {

    return {
        'kind': 'block',
        'type': blockKey
    }

}

export function getPlainToolBox(blockKeys: string[]) {
    return blockKeys.map((blockKey) => {
        return getSimpleToolboxBlock(blockKey);
    });
}


console.log(blockDefinitionsArray)
export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray(blockDefinitionsArray);
// export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray(
//     [testBlock, ...neoPixelBlockDefinitions, ...ledBlockDefinitions, ...servoMotorBlockDefinitions, ...buzzerBlockDefinitions, ...lightBuzzerBlockDefinitation]);


```

## hardwareplayground\workspace\elgotheme.ts

**Size:** 3305 bytes  
**Language:** typescript

```typescript
import Blockly from 'blockly/core';

Blockly.registry.unregister('theme', 'elgo_theme');

export const BlocklyTheme  = Blockly.Theme.defineTheme('customTheme', {
    'name': 'customTheme',
    'blockStyles': {
        'logic_blocks': {
            'colourPrimary': '#a2bdf2', // Light Purple
            'colourSecondary': '#c5d4f7',
            'colourTertiary': '#8ea8e3'
        },
        'loop_blocks': {
            'colourPrimary': '#b6ddb1', // Light Green
            'colourSecondary': '#d0ead2',
            'colourTertiary': '#a1c79b'
        },
        'math_blocks': {
            'colourPrimary': '#93ccea', // Light Blue
            'colourSecondary': '#bde2f7',
            'colourTertiary': '#79b8da'
        },
        'text_blocks': {
            'colourPrimary': '#f9dd87', // Light Yellow
            'colourSecondary': '#fae6a7',
            'colourTertiary': '#f5d46b'
        },
        'list_blocks': {
            'colourPrimary': '#aecbbd', // Light Teal
            'colourSecondary': '#cde2d5',
            'colourTertiary': '#94b6a7'
        },
        'variable_blocks': {
            'colourPrimary': '#eaa8a8', // Light Red
            'colourSecondary': '#f4c5c5',
            'colourTertiary': '#d89090'
        },
        'procedure_blocks': {
            'colourPrimary': '#d3c2b8', // Light Grey
            'colourSecondary': '#e0d6ce',
            'colourTertiary': '#bcae9f'
        }
    },
    'categoryStyles': {
        'logic_category': {
            'colour': '#a2bdf2' // Light Purple
        },
        'loop_category': {
            'colour': '#b6ddb1' // Light Green
        },
        'math_category': {
            'colour': '#93ccea' // Light Blue
        },
        'text_category': {
            'colour': '#f9dd87' // Light Yellow
        },
        'list_category': {
            'colour': '#aecbbd' // Light Teal
        },
        'variable_category': {
            'colour': '#eaa8a8' // Light Red
        },
        'procedure_category': {
            'colour': '#d3c2b8' // Light Grey
        }
    },
    'componentStyles': {
        'workspaceBackgroundColour': '#f5f5f5', // Light grey background for the workspace
        'toolboxBackgroundColour': '#ffffff', // White background for the toolbox
        'toolboxForegroundColour': '#333333', // Dark text for toolbox items
        'flyoutBackgroundColour': '#f5f5f5', // Light grey background for the flyout
        'flyoutForegroundColour': '#000000', // Black text for flyout items
        'flyoutOpacity': 1,
        'scrollbarColour': '#c0c0c0', // Grey scrollbar color
        'scrollbarOpacity': 0.8
    },
    'fontStyle': {
        'family': 'Arial, sans-serif',
        'weight': 'normal',
        'size': 12
    },
    'startHats': true
});

export const blocklyOptions = {
    grid: {
        spacing: 20,
        length: 3,
        colour: '#ccc',
        snap: true
    },
    zoom: {
        controls: true,
        wheel: false,
        startScale: 0.8,
        maxScale: 2,
        minScale: 0.5,
        scaleSpeed: 1.2
    },
    trashcan: true,
    sounds: false,
    move: {
        scrollbars: false,
        drag: false,
        wheel: false
    },
    toolboxPosition: 'start',
    horizontalLayout: false,
    scrollbars: false,
    css: true,
    rtl: false,

};
```

## hardwareplayground\workspace\serialization.ts

**Size:** 951 bytes  
**Language:** typescript

```typescript
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly/core';

const storageKey = 'mainWorkspace';

/**
 * Saves the state of the workspace to browser's local storage.
 * @param workspace Blockly workspace to save.
 */
export const save = function(workspace: Blockly.Workspace): void {
  const data = Blockly.serialization.workspaces.save(workspace);
  window.localStorage?.setItem(storageKey, JSON.stringify(data));
};

/**
 * Loads saved state from local storage into the given workspace.
 * @param workspace Blockly workspace to load into.
 */
export const load = function(workspace: Blockly.Workspace): void {
  const data = window.localStorage?.getItem(storageKey);
  if (!data) return;

  // Don't emit events during loading.
  Blockly.Events.disable();
  Blockly.serialization.workspaces.load(JSON.parse(data), workspace, { recordUndo: false });
  Blockly.Events.enable();
};

```

## hardwareplayground\workspace\toolbox\common\utilsToolbox.ts

**Size:** 279 bytes  
**Language:** typescript

```typescript
export const delay =    {
    'kind': 'block',
    'type': 'delay_ms',
    'inputs': {
        'time': {
            'shadow': {
                'type': 'math_number',
                'fields': {
                    'NUM': 1,
                },
            },
        },
    },
}
```

## hardwareplayground\workspace\toolbox\core\ifElse.ts

**Size:** 674 bytes  
**Language:** typescript

```typescript
import inputsBlockConfig from "@/utils/playground/workspace/toolbox/core/inputs/inputsBlockConfig";

export const ifElseToolbox = [
    {
        "kind": "block",
        "type": "controls_if"
    },
    {
        "kind": "block",
        "type": "math_number"
    },
    {
        "kind": "block",
        "type": "text"
    },
    {
        "kind": "block",
        "type": "logic_compare"
    },

    {
        "kind": "block",
        "type": "variables_get",
        "args0": [
            {
                "type": "field_variable",
                "name": "VAR",
                "variable": "some"  // Change the default name here
            }
        ],
    },



]
```

## hardwareplayground\workspace\toolbox\core\inputs\inputsBlockConfig.ts

**Size:** 1308 bytes  
**Language:** typescript

```typescript
import blockKeys from "@/utils/playground/workspace/blocks/blockKeys";
import BlockKeys from "@/utils/playground/workspace/blocks/blockKeys";
import {LedState} from "@/features/playground/components/simulated-hardwares/modules/led/Led";
// @ts-ignore
import {getSimpleToolboxBlock} from "@/utils/playground/workspace/blocks/blocks";
import {Modules} from "@/features/playground/components/simulated-hardwares/utils/modulesMap";
import {getModuleState} from "@/features/playground/components/simulated-hardwares/utils/commonUtils";
import Blockly from "blockly/core";
import {JavaScript} from "blockly";
import {Order} from "blockly/javascript";
//block definitions
const blockDefinitions = {

    [BlockKeys.lightValue]: {
        "type": blockKeys.lightValue,
        "message0": "light value",
        "output": "Number",
"colour": '#eaa8a8',
        "tooltip": "",
        "helpUrl": ""
    },

}

//toolbox blocks
const toolbox = [
    blockKeys.lightValue,
]


//code generator
const codeGenerator = {
    lightValue: (blocks:any,generators:any) => {
        var code = 'lightValue';
        return [code, generators.ORDER_NONE];
    }
};


const inputsBlockConfig = {
    blockDefinitions: blockDefinitions,
    toolBox: toolbox,
    jsCodeGenerator: codeGenerator
}

export default inputsBlockConfig


```

## hardwareplayground\workspace\toolbox\core\loopsToolbox.ts

**Size:** 298 bytes  
**Language:** typescript

```typescript
export const loopsToolbox = [{
    'kind': 'block',
    'type': 'controls_repeat_ext',
    'inputs': {
        'TIMES': {
            'shadow': {
                'type': 'math_number',
                'fields': {
                    'NUM': 10,
                },
            },
        },
    },
}]
```

## hardwareplayground\workspace\toolbox\core\variablesToolbox.ts

**Size:** 384 bytes  
**Language:** typescript

```typescript
export const variableToolbox = [
    {
        "kind": "block",
        "type": "variables_set",
        "fields": {
            "VAR": "myVariable"
        },
        "values": {
            "VALUE": {
                "kind": "block",
                "type": "math_number",
                "fields": {
                    "NUM": "0"
                }
            }
        }
    }

]
```

## hardwareplayground\workspace\toolbox\toolboxContainer.ts

**Size:** 345 bytes  
**Language:** typescript

```typescript
import NeopixelBlockConfig
    from "@/features/playground/components/simulated-hardwares/modules/neopixel-display/neopixelBlockConfig";

interface Toolbox {
    kind: string;
    contents: any[];
}

export const ToolboxContainer: Toolbox = {

    'kind': 'flyoutToolbox',
    'contents': [
        ...NeopixelBlockConfig.toolBox || []
    ]

}

```

## hardwareplayground\workspace\uicontroller\channelMessages.ts

**Size:** 480 bytes  
**Language:** typescript

```typescript
import {state} from "sucrase/dist/types/parser/traverser/base";

export function moveForward() {
    // @ts-ignore
    window['_elg_pg_comm_channel'].sendMessage('delay', {
        time: 50
    });
    // @ts-ignore
    window['_elg_pg_comm_channel'].sendMessage('CUBE', {
       motion: 'FORWARD'
    });
    // @ts-ignore
    window['_elg_pg_comm_channel'].sendMessage('delay', {
        time: 50
    });
}

export function initializeLightBuzzer(){
    console.log('some')
}




```

## hardwareplayground\workspace\uicontroller\turnonled.ts

**Size:** 174 bytes  
**Language:** typescript

```typescript
export default function turnLed(state: boolean): void {
    (window as any)._elg_pg_comm_channel.sendMessage('LED', {
        active: !!state,
        color: 'red'
    });
}

```

## hardwareplayground\workspace\uicontroller\uiutils.ts

**Size:** 149 bytes  
**Language:** typescript

```typescript
export function delay(seconds: number): void {
    (window as any)._elg_pg_comm_channel.sendMessage('delay', {
        time: seconds * 1000
    });
}
```

## hw-playground-config.ts

**Size:** 395 bytes  
**Language:** typescript

```typescript
export default {
    '0': {
        title: 'Default Playground',
        description: 'A default playground configuration',
        type: 'hardware'
    },
    '1': {
        title: 'LED Control',
        description: 'Control LED components',
        type: 'hardware'
    },
    '2': {
        title: 'Servo Motor',
        description: 'Control servo motor',
        type: 'hardware'
    }
};

```

## modulebuilder\module.db.ts

**Size:** 2318 bytes  
**Language:** typescript

```typescript
import blockKeys from "@/utils/playground/workspace/blocks/blockKeys";
import {Modules} from "@/features/playground/components/simulated-hardwares/utils/modulesMap";
import {
    ControllerType,
    MatrixType
} from "@/features/playground/components/simulated-hardwares/modules/neopixel-display/types";
import BlockKeys from "@/utils/playground/workspace/blocks/blockKeys";

export const stageRefID = "400473830678593602";
export const sectionRefID = "400475005113073730";
export const playgroundRefID = "400480359190364224";

export const localStageData =
    {
        title: "Pro Code",
        description:
            "Requires no coding experience. Suitable for age 9-12. Learn logic building from simple games",
        bgImageUrl: "/stages/category-1.png",
        infoPoints: [
            "Simple Logic Building Games",
            "Suitable for age 9-12",
            "Expert Guided Development",
        ],
        link: "/stages/no-code",
        totalCourses: 10,
        totalDuration: 8,
        level: "1",
    }

    export const sectionTitle = "Loops"








    export const localPlaygroundData =         {
            chapterId: 1,
            type: 'content',
            content: {
                contentId: 0,
                title: "Move pixel 1 step left",
                description: "Move pixel 1 step left",
                media: [
                    {
                        type: "video",
                        url: "",
                        caption: ""
                    }
                ]
            },
            editorConfig: {
                toolboxType: 'flyoutToolbox',
                toolboxContent: [BlockKeys.moveLeft],
            },
            runnerConfig: {
                moduleName: Modules.NeoPixelModule,
                moduleConfig: {
                    matrixSize: 11,
                    matrixType: MatrixType.UNI_DIRECTIONAL,
                    testCase: {
                        initialState: [[5, 5]],
                        expectedOutput: [[5, 4]],
                    },
                    controllerType: ControllerType.blocks
                }
            }
        }



        export const localModuleData = {
            title: "Turn Left",
            description: "This is a sample game 2",
            duration: 10,
    }




```

## modulebuilder\modulebuilder.tsx

**Size:** 2571 bytes  
**Language:** typescript

```typescript
'use client'
import { FC } from 'react';
import { Button } from "@/features/common/components/button/Button";
import {
    localModuleData,
    localPlaygroundData,
    localStageData, playgroundRefID,
    sectionRefID,
    sectionTitle,
    stageRefID
} from "@/features/modulebuilder/module.db";
import { createStage, fetchStageById } from "@/repositories/stageRepo";
import { createSection, fetchSectionById } from "@/repositories/sectionRepo";
import { createModule } from "@/repositories/moduleRepo";
import { createPlayground, fetchPlaygroundById } from "@/repositories/playgroundRepo";

const ModuleBuilder: FC = () => {



    const handleCreateStage = () => {
        createStage(localStageData).then(() => console.log('Stage created successfully!'));
    };

    const handleCreatePlayground = () => {
        createPlayground(localPlaygroundData).then(() => console.log('Playground created successfully!'));
    };

    const handleCreateSection = () => {
        fetchStageById(stageRefID).then((stage: any) => {
            createSection({
                title: sectionTitle,
                stage: stage.ref
            }).then(() => console.log('Section created successfully'));
        });
    };

    const handleCreateModule = () => {
        fetchSectionById(sectionRefID).then((section: any) => {
            fetchPlaygroundById(playgroundRefID).then((playground: any) => {
                createModule({
                   ...localModuleData,
                    section: section.ref,
                    playground: playground.ref
                }).then(() => console.log('Module created successfully'));
            });
        });
    };

    return (
        <main className="flex flex-row overflow-y-auto max-w-desktop p-4 m-4 space-x-4">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleCreateStage}>
                Create Stage
            </button>

            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={handleCreatePlayground}>
                Create Playground
            </button>

            <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded" onClick={handleCreateSection}>
                Create Section
            </button>

            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={handleCreateModule}>
                Create Module
            </button>
        </main>
    );
};

export default ModuleBuilder;

```

## pg-comm-channel.util.ts

**Size:** 2813 bytes  
**Language:** typescript

```typescript
export const GlobalPGCommChannel = '_elg_pg_comm_channel';

export type RegisterPlaygroundComponent = (componentKey: string, callback: (data: any) => void) => void;

// [led off, delay 3000, led on]

export class PlaygroundCommunicationChannel {
    private registeredComponents: { [key: string]: (data: any) => void } = {};

    private messageQueue: { componentKey: string, data?: any }[] = [];

    private queuePaused = false;

    registerComponent(componentKey: string, callback: (data: any) => void) {
        if (this.registeredComponents[componentKey]) {
            console.log(`Component with key ${componentKey} already exists`);
        } else {
            this.registeredComponents[componentKey] = callback;
        }
    }

    private dequeueMessages() {

        while (!this.queuePaused && this.messageQueue.length > 0) {
            const lastMessage = this.messageQueue.pop() || {componentKey: 'none'};
            if (lastMessage.componentKey === 'delay') {
                setTimeout(() => {
                    this.queuePaused = false;
                    this.dequeueMessages();
                }, lastMessage.data.time || 1000);
                this.queuePaused = true;
                break;
            }
            if(lastMessage.componentKey !='')
            this.registeredComponents[lastMessage.componentKey](lastMessage.data);
        }

    }

    private enqueueMessage(componentKey: string, data?: any) {
        this.messageQueue.unshift({componentKey, data});
    }

    sendMessage(componentKey: string, data?: any) {
        this.enqueueMessage(componentKey, data);
        this.dequeueMessages();
    }

    resetQueue() {
        this.messageQueue = [];
    }
}

export function globalSendPlaygroundMessage(componentKey: string, data?: any) {
    // @ts-ignore
    window[GlobalPGCommChannel]?.sendMessage(componentKey, data);
}


export function initPlaygroundCommunication() {
    // @ts-ignore
    window[GlobalPGCommChannel] = new PlaygroundCommunicationChannel();
}

var currentComponentKey = ''

export function getChannelMessage(componentKey: string, payload: any) {
    currentComponentKey = componentKey;
    return `\nwindow['${GlobalPGCommChannel}'].sendMessage('${componentKey}', ${JSON.stringify(payload)});\n`
}

export function getChannelMessageWithDelay(componentKey: string, payload: any,delayTime: number = 200) {
    const delayMessage = `\n window['${GlobalPGCommChannel}'].sendMessage('delay', {time: ${delayTime.toString()}})\n`;
    return delayMessage +getChannelMessage(componentKey, payload) + delayMessage;
}

export function getCodeCompletionCallback() {
    return getChannelMessage(currentComponentKey,{'completed':true});
}

export function resetMessageQueue() {
    // @ts-ignore
    window[GlobalPGCommChannel]?.resetQueue();
}








```

## playground\components\playground-actions\PlaygroundActions.tsx

**Size:** 518 bytes  
**Language:** typescript

```typescript
import {FC} from "react";
import {Button} from "@/features/common/components/button/Button";
import {usePlayground} from "@/features/playground/providers/playground.provider";


export const PlaygroundActions: FC = () => {
    const {runCode, connect} = usePlayground();
    return (
        <div className={'flex flex-row items-center gap-4'}>
            <Button uiType={'primary'} onClick={connect}>Connect</Button>
            <Button uiType={'primary'} onClick={()=>runCode()}>Run</Button>
        </div>
    )
}

```

## playground\components\playground-container\PlaygroundContainer.tsx

**Size:** 1508 bytes  
**Language:** typescript

```typescript
'use client';
import React, {FC} from 'react';
import {PlaygroundEditor} from "@/features/playground/components/playground-editor/PlaygroundEditor";
import {PlaygroundProvider} from "@/features/playground/providers/playground.provider";
import {ProblemStatement} from "@/features/playground/components/playground-problem-statement/ProblemStatement";
import {PlaygroundContainerContent} from "@/content/banner-main/playground-container.content";
import {PlaygroundRunner} from "@/features/playground/components/playground-runner/PlaygroundRunner";
import {Button} from "@/features/common/components/button/Button";
import {fetchPlaygroundById} from "@/repositories/playgroundRepo";

interface PlaygroundState{
    state:any
}
export const PlayGroundContainer: FC<PlaygroundState> = ({state}) => {

    const [containerState, setContainerState] = React.useState(state)

    return (

        <PlaygroundProvider>
            <div className={'flex flex-row items-center'}>

                <div className={'flex flex-col flex-grow'}>
                    <ProblemStatement problem={containerState.content.title}
                                      description={containerState.content.description}/>
                    <PlaygroundEditor editorConfig={containerState.editorConfig}/>
                </div>
                <div className="w-1/2">
                    <PlaygroundRunner runnerConfig={containerState.runnerConfig}/>
                </div>

            </div>
        </PlaygroundProvider>

    )
}

```

## playground\components\playground-container\ProblemCard.tsx

**Size:** 4316 bytes  
**Language:** typescript

```typescript
import React from 'react';

// TypeScript interface for the problem data
interface ProblemData {
    id: string;
    title: string;
    description: string;
    difficulty?: 'Easy' | 'Medium' | 'Hard';
    tags?: string[];
}

// Props for the ProblemCard component
interface ProblemCardProps {
    problem: ProblemData;
    onSelect?: (id: string) => void;
}

// Separate component for displaying problem details
const ProblemCard: React.FC<ProblemCardProps> = ({problem, onSelect}) => {
    const {id, title, description, difficulty, tags} = problem;

    // Determine background color based on difficulty
    const getDifficultyColor = () => {
        switch (difficulty) {
            case 'Easy':
                return 'bg-green-100 text-green-800';
            case 'Medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'Hard':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div
            className="flex flex-col bg-gray-200 mr-10 ml-10 p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onSelect && onSelect(id)}
        >
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                {difficulty && (
                    <span className={`px-2 py-1 text-xs font-medium rounded-md ${getDifficultyColor()}`}>
            {difficulty}
          </span>
                )}
            </div>

            <p className="text-gray-600 mb-3 line-clamp-2">{description}</p>

            {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-auto">
                    {tags.map((tag, index) => (
                        <span
                            key={index}
                            className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                        >
              {tag}
            </span>
                    ))}
                </div>
            )}
        </div>
    );
};

// Main component for the horizontal problem list
interface ProblemListProps {
    problems: ProblemData[];
    onSelectProblem?: (id: string) => void;
}

const ProblemList: React.FC<ProblemListProps> = ({problems, onSelectProblem}) => {
    return (
        <div className="container mx-auto p-4">
            <h2 className="text-xl font-bold mb-4">Problems</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {problems.map((problem) => (
                    <ProblemCard
                        key={problem.id}
                        problem={problem}
                        onSelect={onSelectProblem}
                    />
                ))}
            </div>
        </div>
    );
};

// Example usage with sample data
const ProblemStatement: React.FC = () => {
    const sampleProblems: ProblemData[] = [
        {
            id: 'p1',
            title: 'Two Sum',
            description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
            difficulty: 'Easy',
            tags: ['Array', 'Hash Table']
        },
        {
            id: 'p2',
            title: 'Merge Intervals',
            description: 'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.',
            difficulty: 'Medium',
            tags: ['Array', 'Sorting']
        },
        {
            id: 'p3',
            title: 'Median of Two Sorted Arrays',
            description: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.',
            difficulty: 'Hard',
            tags: ['Array', 'Binary Search', 'Divide and Conquer']
        }
    ];

    const handleSelectProblem = (id: string) => {
        console.log(`Selected problem with id: ${id}`);
        // Here you could navigate to a detail page or show more info
    };

    return (
        <ProblemCard
            key={"id"}
            problem={sampleProblems[0]}
            onSelect={handleSelectProblem}
        />
    );
};

export default ProblemStatement;
```

## playground\components\playground-container\SoftPlaygroundContainer.tsx

**Size:** 9873 bytes  
**Language:** typescript

```typescript
import React, {FC} from 'react';
import {Cpu, Zap, Code2, MonitorSmartphone, Terminal, Layers} from 'lucide-react';
import {PlaygroundState} from "@/features/playground/components/playground-container/swPlaygroundContainer";
import {PlaygroundEditor} from "@/features/playground/components/playground-editor/PlaygroundEditor";
import {PlaygroundRunner} from "@/features/playground/components/playground-runner/PlaygroundRunner";
import {usePlayground} from "@/features/playground/providers/playground.provider";
import ProblemStatement from "@/features/playground/components/playground-container/ProblemCard";
import {useRouter} from 'next/router';
import {Navigation, createSuccessHandler} from './swplaygroundnav'; // Adjust path as needed


// Header Component
interface HeaderProps {
    title: string;
    description: string;
    onConnect: () => void;
    onRunCode: () => void;
    isDeviceConnected: boolean;
}

const Header: FC<HeaderProps> = ({
                                     title,
                                     description,
                                     onConnect,
                                     onRunCode,
                                     isDeviceConnected
                                 }) => {
    const onSuccess = createSuccessHandler();
    return (
        <header className="bg-gray-900 border-b border-blue-500/30 shadow-lg p-2">
            <div className="container mx-auto">


                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row gap-4 items-start justify-between">
                    {/* Enhanced Description Box */}
                    <div className="bg-gray-800/80 border-l-4 border-blue-500 rounded-r-md p-3 shadow-lg  w-full">

                        <div className="flex flex-row justify-between items-center ">
                            <div className="flex items-center ">
                                <Layers className="text-blue-400 mr-2" size={18}/>
                                <h2 className="text-lg font-semibold text-blue-300">Current Challenge</h2>
                            </div>
                            {/* Action Buttons */}
                            <div className="flex items-center  space-x-3 self-center md:self-end">
                                <button
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center shadow-md transition duration-200"
                                    onClick={onConnect}
                                >
                                    <Zap size={16} className="mr-2"/> Connect Device
                                </button>
                                <button
                                    className={`text-white px-2 py-2 rounded-md flex items-center shadow-md transition duration-200 ${
                                        isDeviceConnected
                                            ? "bg-emerald-500 hover:bg-emerald-600"
                                            : "bg-rose-500 hover:bg-rose-600"
                                    }`}
                                    onClick={onRunCode}
                                >
                                    <Terminal size={16} className="mr-2"/>
                                    {isDeviceConnected ? "Run Code" : "Run (Disconnected)"}
                                </button>
                            </div>

                        </div>

                        <p className="text-base mt-2 text-gray-300">
                            {`☸ ${description}` || "Explore detailed insights in a clean format."}
                        </p>
                        <Navigation onSuccess={onSuccess}/>

                    </div>


                </div>
            </div>
        </header>
    );
};
const ContentSection: React.FC<{ title: string; description: string }> = ({title, description}) => {
    return (
        <div className="bg-gray-900 rounded-lg shadow-lg p-4 mt-5 ml-3 mr-3 mx-auto">
            <h1 className="text-3xl font-extrabold text-white border-b border-gray-700 pb-3 mb-4">
                {title || "Your Title Goes Here"}
            </h1>
            <p className="text-lg font-medium text-gray-300 leading-relaxed">
                {description || "Explore detailed insights and captivating content presented in a clean, user-friendly format."}
            </p>
        </div>
    );
};

// Editor Panel Component
interface EditorPanelProps {
    editorConfig: any;
    className?: string;
}

const EditorPanel: FC<EditorPanelProps> = ({editorConfig, className}) => {
    return (
        <div className={className}>
            <div className="bg-gray-800 rounded-lg border border-blue-500/30 shadow-lg overflow-hidden h-full">
                <div className="flex items-center justify-between bg-gray-700 px-4 py-2">
                    <div className="flex items-center">
                        <Code2 size={18} className="text-blue-400 mr-2"/>
                        <h2 className="font-bold">Blockly Editor</h2>
                    </div>
                    <div className="flex space-x-2">

                    </div>
                </div>
                <div className="bg-gray-700/50 relative">
                    <PlaygroundEditor editorConfig={editorConfig}/>
                </div>
            </div>
        </div>
    );
};

const Console: FC = () => {
    return (
        <div className="bg-gray-900 p-2 flex flex-col h-full">
            <div className="flex items-center text-xs text-gray-400 mb-1">
                <Terminal size={12} className="mr-1"/>
                <span>CONSOLE</span>
            </div>
            <div className="font-mono text-xs bg-black/90 p-2 rounded flex-grow overflow-y-auto text-green-500">
                <div className="font-mono text-xs bg-black/90 p-2 rounded h-48 overflow-y-auto text-green-500">
                    <div className="text-blue-400">[INFO]: Initializing hardware...</div>
                    <div className="text-green-500">[SUCCESS]: Connection established to module on pin D4</div>
                    <div className="text-blue-400">[INFO]: Loading hardware configurations...</div>
                    <div className="text-green-500">[SUCCESS]: Module detected, parameters set</div>
                    <div className="text-cyan-400">[DEBUG]: Refresh rate set to 60fps</div>
                    <div className="text-yellow-400">[WARN]: Module response time exceeds optimal threshold</div>
                    <div className="text-gray-400">[STATUS]: Hardware awaiting command...</div>
                    <div className="text-blue-400">[INFO]: Running operation on module...</div>
                    <div className="text-green-500">[SUCCESS]: Operation completed successfully</div>
                    <div className="text-cyan-400">[DEBUG]: System optimized for current workload</div>
                    <div className="text-gray-400">[STATUS]: All modules operational</div>
                </div>
            </div>
        </div>
    );
};

// Hardware Panel Component
interface HardwarePanelProps {
    runnerConfig: any;
    className?: string;
}

const HardwarePanel: FC<HardwarePanelProps> = ({runnerConfig, className}) => {
    return (
        <div className={className}>
            <div
                className="bg-gray-800 rounded-lg border border-blue-500/30 shadow-lg overflow-hidden flex flex-col h-full">
                <div className="flex items-center justify-between bg-gray-700 px-4 py-2">
                    <div className="flex items-center">
                        <MonitorSmartphone size={18} className="text-green-400 mr-2"/>
                        <h2 className="font-bold">Virtual Hardware</h2>
                    </div>
                </div>

                {/* Runner container with only the space it needs */}
                <div className="p-4 bg-black/70">
                    <PlaygroundRunner runnerConfig={runnerConfig}/>
                </div>


                {/* Console takes remaining vertical space with flex-grow */}
                <div className="flex-grow flex flex-col">
                    <Console/>
                </div>
            </div>
        </div>
    );
};

// Footer Component
interface FooterProps {
    version: string;
}

const Footer: FC<FooterProps> = ({version}) => {
    return (
        <footer className="bg-gray-800 border-t border-blue-500/30 p-3 text-center text-sm text-gray-400">
            <div className="flex items-center justify-center">
                <Layers size={14} className="mr-1"/>
                <span>Elgorithm Playground v{version}</span>
            </div>
        </footer>
    );
};

// Main Component
export const NeoPixelPlayground: FC<PlaygroundState> = ({state}) => {
    const {connect, isDeviceConnected, runCode} = usePlayground();
    const onSuccess = createSuccessHandler();


    return (
        <div className="flex flex-col min-h-screen bg-black-500 text-gray-100">
            <Header
                title={state.content.title}
                description={state.content.description}
                onConnect={connect}
                onRunCode={runCode}
                isDeviceConnected={isDeviceConnected}
            />


            <main className="flex-grow container mx-auto p-2">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    <EditorPanel
                        editorConfig={state.editorConfig}
                        className="lg:col-span-2"
                    />

                    <HardwarePanel
                        runnerConfig={state.runnerConfig}
                        className="lg:col-span-1"
                    />
                </div>
            </main>

            <Footer version="1.0"/>
        </div>
    );
};
```

## playground\components\playground-container\swPlaygroundContainer.tsx

**Size:** 996 bytes  
**Language:** typescript

```typescript
'use client';
import React, {FC} from 'react';
import {PlaygroundEditor} from "@/features/playground/components/playground-editor/PlaygroundEditor";
import {PlaygroundProvider} from "@/features/playground/providers/playground.provider";
import {ProblemStatement} from "@/features/playground/components/playground-problem-statement/ProblemStatement";
import {PlaygroundRunner} from "@/features/playground/components/playground-runner/PlaygroundRunner";
import {NeoPixelPlayground} from "@/features/playground/components/playground-container/SoftPlaygroundContainer";

export interface PlaygroundState {
    state: any;
}

export const SWPlayGroundContainer: FC<PlaygroundState> = ({state}) => {
    const [containerState, setContainerState] = React.useState(state);

    return (
        <PlaygroundProvider>
            <div className=" flex-col items-center justify-center ">
                <NeoPixelPlayground state={containerState}/>
            </div>
        </PlaygroundProvider>
    );
};
```

## playground\components\playground-container\swplaygroundnav.tsx

**Size:** 2109 bytes  
**Language:** typescript

```typescript
import React from 'react';
import {Zap} from "lucide-react";

interface NavigationProps {
    onSuccess?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onSuccess }) => {
    // Navigation functions using window.location instead of router
    const goToNextPage = () => {
        const currentPath = window.location.pathname;
        const currentPageMatch = currentPath.match(/\/swplayground\/(\d+)/);
        const currentPage = currentPageMatch ? parseInt(currentPageMatch[1], 10) : 1;
        window.location.href = `/swplayground/${currentPage + 1}`;

        if (onSuccess) {
            onSuccess();
        }
    };

    const goToPreviousPage = () => {
        const currentPath = window.location.pathname;
        const currentPageMatch = currentPath.match(/\/swplayground\/(\d+)/);
        const currentPage = currentPageMatch ? parseInt(currentPageMatch[1], 10) : 1;
        if (currentPage > 1) {
            window.location.href = `/swplayground/${currentPage - 1}`;
        }
    };

    return (
        <div className="flex justify-between mt-2">

            <button
                className="bg-red-400 mr-5 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center"
                onClick={goToPreviousPage}
            >
                <Zap size={16} className="mr-1"/>   ← Previous
            </button>
            <button
                className="bg-green-400 hover:bg-green-600 text-white px-3 py-1 rounded flex items-center"
                onClick={goToNextPage}
            >
                <Zap size={16} className="mr-1"/> Next →
            </button>
        </div>
    );
};

// Standalone success function using window.location
export const createSuccessHandler = () => {
    return () => {
        const currentPath = window.location.pathname;
        const currentPageMatch = currentPath.match(/\/swplayground\/(\d+)/);
        const currentPage = currentPageMatch ? parseInt(currentPageMatch[1], 10) : 1;
        console.log("Success! Moving to next page...");
        window.location.href = `/swplayground/${currentPage + 1}`;
    };
};
```

## playground\components\playground-editor\PlaygroundEditor.tsx

**Size:** 1479 bytes  
**Language:** typescript

```typescript
'use client';
import React, {FC, useEffect, useRef, useState} from "react";
import {usePlayground} from "@/features/playground/providers/playground.provider";
import {PlaygroundActions} from "@/features/playground/components/playground-actions/PlaygroundActions";
import {getPlainToolBox, getSimpleToolboxBlock} from "@/utils/playground/workspace/blocks/blocks";
import {Button} from "@/features/common/components/button/Button";
import Dropdown from "@/features/common/DropDown";

interface PlaygroundEditorProps {
    editorConfig: any;
}

export const PlaygroundEditor: FC<PlaygroundEditorProps> = ({editorConfig}) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const initializedEditor = useRef(false);
    const toolboxContainer = {
        'kind': editorConfig.toolboxType,
        'contents': getPlainToolBox(editorConfig.toolboxContent)
    }
    const {initPlayground, connect, isDeviceConnected, runCode} = usePlayground();


    useEffect(() => {
        if (editorRef.current && !initializedEditor.current) {
            initPlayground(editorRef.current, toolboxContainer);
            initializedEditor.current = true;
        }
    }, []);
    return (
        <main className={``}> {/*  Main container */}
            <PlaygroundActions/>
            <div
                ref={editorRef}
                className="bg-gray-300 rounded-lg h-full w-full"
                style={{width: "990px", height: "640px"}}
            />
        </main>

    )
}

```

## playground\components\playground-problem-statement\ProblemStatement.tsx

**Size:** 504 bytes  
**Language:** typescript

```typescript
import {FC} from "react";
import clsx from "clsx";

export interface ProblemStatementProps {
    problem: string;
    description: string;
}

export const ProblemStatement: FC<ProblemStatementProps> = ({problem, description})=>{
    return (
        <div className={clsx('flex flex-col gap-4 flex-grow text-left items-start')}>
            <p className="text-2xl text-gray-900 dark:text-black">{problem}</p>
            <p className="text-lg text-content-light ">{description}</p>
        </div>
    );
}
```

## playground\components\playground-runner\PlaygroundRunner.tsx

**Size:** 866 bytes  
**Language:** typescript

```typescript
import React, {FC} from 'react';
import {getModule, Module, Modules} from "@/features/playground/components/simulated-hardwares/utils/modulesMap";

interface PlaygroundRunnerProps {
    runnerConfig: any
}

export const PlaygroundRunner: FC<PlaygroundRunnerProps> = ({runnerConfig}) => {

    const isMultiState = runnerConfig.moduleName === Modules.NeoPixelModule
    return (
        <div
            className={` rounded-xl shadow-lg border border-gray-400 relative p-4`}
            style={{
                backgroundImage: "url('/path/to/tech-background.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            {isMultiState
                ? getModule(Modules.NeoPixelModule, runnerConfig.moduleConfig)
                : <Module runnerConfig={runnerConfig}/>}
        </div>

    )
}

```

## playground\components\simulated-hardwares\modules\buzzer\Buzzer.tsx

**Size:** 449 bytes  
**Language:** typescript

```typescript
import {FC, useEffect} from "react";

import '@wokwi/elements';


export interface BuzzerState {
    buzz: boolean;
}

export const Buzzer: FC<BuzzerState> = ({buzz}) => {

    useEffect(() => {
        const beep = new Audio('/beep.mp3');
        if (buzz) beep.play()
        else beep.pause()
    }, [buzz]);

    return <div className={'flex flex-col p-2'}>
        <wokwi-buzzer hasSignal={buzz ? true : undefined}></wokwi-buzzer>
    </div>
}

```

## playground\components\simulated-hardwares\modules\buzzer\buzzerModuleBlockConfig.ts

**Size:** 2473 bytes  
**Language:** typescript

```typescript
import blockKeys from "@/utils/playground/workspace/blocks/blockKeys";
import BlockKeys from "@/utils/playground/workspace/blocks/blockKeys";

// @ts-ignore
import {getSimpleToolboxBlock} from "@/utils/playground/workspace/blocks/blocks";
import {BuzzerState} from "@/features/playground/components/simulated-hardwares/modules/buzzer/Buzzer";
import {getModuleState} from "@/features/playground/components/simulated-hardwares/utils/commonUtils";
import {Modules} from "@/features/playground/components/simulated-hardwares/utils/modulesMap";
import ModuleConfigConstants
    from "@/features/playground/components/simulated-hardwares/modules/common/moduleConfigConstants";
import moduleConfigConstants
    from "@/features/playground/components/simulated-hardwares/modules/common/moduleConfigConstants";
import {
    pythonFunction, PythonFunctionKey,
    pythonImport,
    PythonImportKey, setPinValue
} from "@/features/playground/components/simulated-hardwares/modules/common/commonModules";


//block definitions
const blockDefinitions = {

    [BlockKeys.turnOnBuzzer]: {
        "type": blockKeys.turnOnBuzzer,
        "message0": "Turn on Buzzer",
        "previousStatement": null,
        "nextStatement": null,
        "colour": '#eaa8a8',
        "tooltip": "",
        "helpUrl": ""
    },
    [BlockKeys.turnOffBuzzer]: {
        "type": blockKeys.turnOffBuzzer,
        "message0": "Turn off Buzzer",
        "previousStatement": null,
        "nextStatement": null,
        "colour": '#eaa8a8',
        "tooltip": "",
        "helpUrl": ""
    }


}


//toolbox blocks


const toolbox = [
    blockKeys.turnOnBuzzer,
    blockKeys.turnOffBuzzer,
]


//code generator
const pyCodeGenerator = {
    [blockKeys.turnOnBuzzer]: () => getBuzzerBlockCode({buzz: true}),
    [blockKeys.turnOffBuzzer]: () => getBuzzerBlockCode({buzz: false}),
};

//code generator
const jsCodeGenerator = {
    [blockKeys.turnOnBuzzer]: () => setPinValue(8, 1),
    [blockKeys.turnOffBuzzer]: () => setPinValue(8, 0),
};


function getBuzzerBlockCode(payload: BuzzerState) {
    return `await delay(500);\nawait changeState(${getModuleState(Modules.BuzzerModule, payload)});\n`
}

const buzzerBlockConfig = {
    [moduleConfigConstants.BLOCK_DEFINITIONS]: blockDefinitions,
    [ModuleConfigConstants.TOOLBOX]: toolbox,
    [ModuleConfigConstants.PY_CODE_GENERATOR]: pyCodeGenerator,
    [ModuleConfigConstants.JS_CODE_GENERATOR]: jsCodeGenerator
}

export default buzzerBlockConfig


```

## playground\components\simulated-hardwares\modules\common\commonModules.ts

**Size:** 1471 bytes  
**Language:** typescript

```typescript
import {forPyBlock} from "@/utils/playground/workspace/blocks/blocks";
import {pythonGenerator} from "blockly/python";
import BlockKeys from "@/utils/playground/workspace/blocks/blockKeys";
import blockKeys from "@/utils/playground/workspace/blocks/blockKeys";

export enum PythonImportKey {
    MACHINE,
    PIN,
    TIME
}

export function pythonImport(key: PythonImportKey) {
    switch (key) {
        case PythonImportKey.PIN:
            pythonGenerator.definitions_['import_pin'] = 'from machine import Pin';
            break;
        case PythonImportKey.MACHINE:
            pythonGenerator.definitions_['import_machine'] = 'import machine';
            break;
        case PythonImportKey.TIME:
            pythonGenerator.definitions_['import_time'] = 'import time';
            break;
    }
}

export function setPinValue(pin:number,value: number) {
    pythonImport(PythonImportKey.PIN)
    pythonFunction(PythonFunctionKey.GPIO_SET)
    return 'gpio_set(' + pin + ', ' + value + ')\n';
}

export function pyDelay(value: number) {
    pythonImport(PythonImportKey.TIME)
    return 'time.sleep(' + value + ')\n';
}


export enum PythonFunctionKey{
    GPIO_SET
}

export function pythonFunction(key: PythonFunctionKey) {
    switch (key){
        case PythonFunctionKey.GPIO_SET:
            pythonGenerator.definitions_['gpio_set'] = 'def gpio_set(pin,value):\n  if value >= 1:\n    Pin(pin, Pin.OUT).on()\n  else:\n    Pin(pin, Pin.OUT).off()';

    }
}



```

## playground\components\simulated-hardwares\modules\common\delayBlockConfig.ts

**Size:** 1030 bytes  
**Language:** typescript

```typescript
import blockKeys from "@/utils/playground/workspace/blocks/blockKeys";

import {
    pyDelay,
    pythonImport,
    PythonImportKey
} from "@/features/playground/components/simulated-hardwares/modules/common/commonModules";

//block definitions
const blockDefinitions = {

    [blockKeys.delay]: {
        "type": blockKeys.delay,
        "message0": "delay %1 ms",
        "args0": [
            {
                "type": "input_value",  
                "name": "DELAY_TIME",   
                "check": "Number"     
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": '#eaa8a8',
        "tooltip": "",
        "helpUrl": ""
    }

}

//toolbox blocks
const toolbox = [
    blockKeys.delay
]


//code generator
// const jsCodeGenerator = {

// };

const pyCodeGenerator = {
    delay: () => pyDelay(1),
};


const delayBlockConfig = {
    blockDefinitions: blockDefinitions,
    toolBox: toolbox,
    pyCodeGenerator: pyCodeGenerator
}

export default delayBlockConfig


```

## playground\components\simulated-hardwares\modules\common\moduleConfigConstants.ts

**Size:** 151 bytes  
**Language:** typescript

```typescript
enum ModuleConfigConstants  {
    JS_CODE_GENERATOR,
    PY_CODE_GENERATOR,
    TOOLBOX,
    BLOCK_DEFINITIONS
}

export default ModuleConfigConstants;
```

## playground\components\simulated-hardwares\modules\LCD\LCD.tsx

**Size:** 240 bytes  
**Language:** typescript

```typescript
'use client';

import {FC} from "react";
import '@wokwi/elements';



export interface LCDState {
    text: string,
}


export const LCD: FC<LCDState> = ({text}) => {
    return (
        <wokwi-lcd1602 text={text}></wokwi-lcd1602>
    )
}

```

## playground\components\simulated-hardwares\modules\led\Led.tsx

**Size:** 297 bytes  
**Language:** typescript

```typescript
'use client';

import {FC} from "react";
import '@wokwi/elements';



export interface LedState {
    color: string,
    active: boolean
}


export const Led: FC<LedState> = ({color,active}) => {
    return (
        <wokwi-led color={color} value={active ? true : undefined}></wokwi-led>
    )
}

```

## playground\components\simulated-hardwares\modules\led\ledModuleBlockConfig.ts

**Size:** 2380 bytes  
**Language:** typescript

```typescript
import blockKeys from "@/utils/playground/workspace/blocks/blockKeys";
import BlockKeys from "@/utils/playground/workspace/blocks/blockKeys";
import {LedState} from "@/features/playground/components/simulated-hardwares/modules/led/Led";
// @ts-ignore
import {Modules} from "@/features/playground/components/simulated-hardwares/utils/modulesMap";
import {getModuleState} from "@/features/playground/components/simulated-hardwares/utils/commonUtils";
import {
    pyDelay,
    pythonFunction,
    PythonFunctionKey,
    pythonImport,
    PythonImportKey, setPinValue
} from "@/features/playground/components/simulated-hardwares/modules/common/commonModules";

//block definitions
const blockDefinitions = {

    [BlockKeys.turnOnLed]: {
        "type": blockKeys.turnOnLed,
        "message0": "Turn on led",
        "previousStatement": null,
        "nextStatement": null,
"colour": '#eaa8a8',
        "tooltip": "",
        "helpUrl": ""
    },
    [BlockKeys.turnOffLed]: {
        "type": blockKeys.turnOffLed,
        "message0": "Turn off led",
        "previousStatement": null,
        "nextStatement": null,
"colour": '#eaa8a8',
        "tooltip": "",
        "helpUrl": ""
    },
    [BlockKeys.blinkLed]: {
        "type": blockKeys.blinkLed,
        "message0": "Blink led",
        "previousStatement": null,
        "nextStatement": null,
        "colour": '#eaa8a8',
        "tooltip": "",
        "helpUrl": ""
    },


}

//toolbox blocks
const toolbox = [
    blockKeys.turnOnLed,
    blockKeys.turnOffLed,
    blockKeys.blinkLed,
]


//code generator
const jsCodeGenerator = {
    turnOnLed: () => getLedBlockCode({active: false, color: 'red'}),
    turnOffLed: () => getLedBlockCode({active: false, color: 'red'}),
    blinkLed: () => getLedBlockCode({active: true, color: 'red'}) + getLedBlockCode({active: false, color: 'red'})
};

const pyCodeGenerator = {
    turnOnLed: () => setPinValue(2,1),
    turnOffLed: () => setPinValue(2,0),
    blinkLed: () => setPinValue(2,1) + pyDelay(1) + setPinValue(2,0),
};




function getLedBlockCode(payload: LedState) {
    return `await delay(400);\nawait changeState(${getModuleState(Modules.LedModule, payload)});\n`
}

const ledBlockConfig = {
    blockDefinitions: blockDefinitions,
    toolBox: toolbox,
    jsCodeGenerator: jsCodeGenerator,
    pyCodeGenerator: pyCodeGenerator
}

export default ledBlockConfig


```

## playground\components\simulated-hardwares\modules\neopixel-display\ModuleBaseViewModel.tsx

**Size:** 1702 bytes  
**Language:** typescript

```typescript
import {usePlayground} from "@/features/playground/providers/playground.provider";
import _ from "lodash";

interface ModuleBaseViewModelProps {
    handleFailure: (message: string) => null;
    handleSuccess: (message: string) => null;
}

interface CompletionStatus {
    status: boolean;
    message: string;

}

export const useModuleBaseViewModel = () => {
    const {getJsCode} = usePlayground();

    function getCompletionStatus(expectedPixelPath: any[], actualPixelPath: any[]): CompletionStatus {
        if (actualPixelPath.length === 0) return {status: false, message: 'No code to execute!'}
        if (expectedPixelPath.length === 0 || actualPixelPath.length != expectedPixelPath.length) return {
            status: false,
            message: 'Steps not as expected!'
        }
        if (_.isEqual(actualPixelPath, expectedPixelPath)) return {status: true, message: 'proceed to next chapter'}
        else return {status: false, message: 'Steps not as expected!'}
    }

    function executeCode(functions: any[], args: string[], completionHandler: () => void) {
        let code = getJsCode()
        if(code!=''){
            let completionHandlerName = 'handleCodeCompletion'
            if(completionHandler.name != completionHandlerName){
                console.log("please supply codeCompletionHandler function name as **handleCodeCompletion** as params are hardcoded")
                return
            }
            const execute = new Function(...args, 'handleCodeCompletion', code)
            execute(...functions, completionHandler);
        }
        else console.log('no code found from Js block code generator!')

    }


    return {getCompletionStatus,executeCode}
}
```

## playground\components\simulated-hardwares\modules\neopixel-display\neopixelBlockConfig.ts

**Size:** 3815 bytes  
**Language:** typescript

```typescript
import blockKeys from "@/utils/playground/workspace/blocks/blockKeys";
import BlockKeys from "@/utils/playground/workspace/blocks/blockKeys";
import {Direction} from "@/features/playground/components/simulated-hardwares/modules/neopixel-display/types";
//block definitions
const blockDefinitions = {

    [blockKeys.moveUp]: {
        "type": blockKeys.moveUp,
        "message0": "Move up",
        "previousStatement": null,
        "nextStatement": null,
        "colour": '#eaa8a8',
        "tooltip": "",
        "helpUrl": ""
    }
    ,

    [blockKeys.moveDown]: {
        "type": blockKeys.moveDown,
        "message0": "Move down",
        "previousStatement": null,
        "nextStatement": null,
        "colour": '#eaa8a8',
        "tooltip": "",
        "helpUrl": ""
    }
    ,

    [blockKeys.moveRight]: {
        "type": blockKeys.moveRight,
        "message0": "Move right",
        "previousStatement": null,
        "nextStatement": null,
        "colour": '#eaa8a8',
        "tooltip": "",
        "helpUrl": ""
    }
    ,

    [blockKeys.moveLeft]: {
        "type": blockKeys.moveLeft,
        "message0": "Move left",
        "previousStatement": null,
        "nextStatement": null,
        "colour": '#eaa8a8',
        "tooltip": "",
        "helpUrl": ""
    },

    [blockKeys.moveTopLeft]: {
        "type": blockKeys.moveTopLeft,
        "message0": "Move top left",
        "previousStatement": null,
        "nextStatement": null,
        "colour": '#eaa8a8',
        "tooltip": "",
        "helpUrl": ""
    },

    [blockKeys.moveTopRight]: {
        "type": blockKeys.moveTopRight,
        "message0": "Move top right",
        "previousStatement": null,
        "nextStatement": null,
        "colour": '#eaa8a8',
        "tooltip": "",
        "helpUrl": ""
    },

    [blockKeys.moveBottomLeft]: {
        "type": blockKeys.moveBottomLeft,
        "message0": "Move bottom left",
        "previousStatement": null,
        "nextStatement": null,
        "colour": '#eaa8a8',
        "tooltip": "",
        "helpUrl": ""
    },

    [blockKeys.moveBottomRight]: {
        "type": blockKeys.moveBottomRight,
        "message0": "Move bottom right",
        "previousStatement": null,
        "nextStatement": null,
        "colour": '#eaa8a8',
        "tooltip": "",
        "helpUrl": ""
    },


}

//toolbox blocks

function getToolboxBlock(blockKey: string): any {
    return {
        'kind': 'block',
        'type': blockKey
    }

}

const straightToolbox = [
    blockKeys.moveDown,
    blockKeys.moveRight,
    blockKeys.moveUp,
    blockKeys.moveLeft,
]
const verticalToolbox = [
    (blockKeys.moveBottomLeft),
    (blockKeys.moveBottomRight),
    (blockKeys.moveTopLeft),
    (blockKeys.moveTopRight),
]


//code generator
const codeGenerator = {
    moveUp: (blocks: any, generators: any) => getBlockCode(Direction.Up),
    moveDown: (blocks: any, generators: any) => getBlockCode(Direction.Down),
    moveLeft: (blocks: any, generators: any) => getBlockCode(Direction.Left),
    moveRight: (blocks: any, generators: any) => getBlockCode(Direction.Right),
    moveTopLeft: (blocks: any, generators: any) => getBlockCode(Direction.TopLeft),
    moveTopRight: (blocks: any, generators: any) => getBlockCode(Direction.TopRight),
    moveBottomLeft: (blocks: any, generators: any) => getBlockCode(Direction.BottomLeft),
    moveBottomRight: (blocks: any, generators: any) => getBlockCode(Direction.BottomRight),
    stop: (blocks: any, generators: any) => getBlockCode(Direction.Stop),
};

function getBlockCode(payload: Direction) {
    return `await delay(200);\nmove('${payload}');\n`
}

const neopixelBlockConfig = {
    blockDefinitions: blockDefinitions,
    toolBox: straightToolbox,
    jsCodeGenerator: codeGenerator
}

export default neopixelBlockConfig


```

## playground\components\simulated-hardwares\modules\neopixel-display\NeoPixelDirect.tsx

**Size:** 1725 bytes  
**Language:** typescript

```typescript
import React, {FC} from "react";
import '@wokwi/elements';
import {ControllerType, MatrixType, TestCase} from "./types";
import {Button} from "@/features/common/components/button/Button";
import {
    useNeoPixelViewModel
} from "@/features/playground/components/simulated-hardwares/modules/neopixel-display/NeoPixelViewModel";
import {Zap} from "lucide-react";
import RunButton from "@/features/playground/components/simulated-hardwares/utils/modulesMap";

/*
 Test case 1 : move pixel right;
 Test case 2 : move pixel right 3 times
 Test case 3 : Joint 2 pixels using the shortest path
 */


//indirect component
//dynamic component


interface NeoPixelMatrixProps {
    matrixSize: number;
    matrixType: MatrixType;
    testCase: TestCase;
    controllerType: ControllerType
}

export const COMPONENT_KEY = 'NEO_PIXEL_DIRECT';


export const NeoPixelDirect: FC<NeoPixelMatrixProps> = ({matrixType, testCase, matrixSize, controllerType}) => {

    const buttonVisibilityClass = controllerType === ControllerType.blocks ? "block" : "hidden";

    const {neoPixelDisplayRef, animation, executeBlockCode} = useNeoPixelViewModel({
        matrixType,
        testCase,
        matrixSize,
        controllerType,
    });
    return (

        <div className={'flex-col items-center justify-center'}>

            <div className={' bg-black flex flex-col gap-4 p-2'}>
                <wokwi-neopixel-matrix ref={neoPixelDisplayRef} rows={matrixSize} cols={matrixSize}
                                       blurLight={true}
                                       animation={animation ? true : undefined}></wokwi-neopixel-matrix>
            </div>
            <RunButton onClick={executeBlockCode}/>

        </div>
    );
};

```

## playground\components\simulated-hardwares\modules\neopixel-display\NeoPixelUtils.ts

**Size:** 1304 bytes  
**Language:** typescript

```typescript
import {Direction, Position} from './types';

export function calculateMove(direction: Direction, position: number[]): number[] {
    const verticalOffset = getVerticalOffset(direction);
    const horizontalOffset = getHorizontalOffset(direction);

    const newRow = position[0] + verticalOffset;
    const newColumn = position[1] + horizontalOffset;

    return [newRow,newColumn]
}

export function isValidPosition(row: number, column: number, matrixSize: number): boolean {
    return row >= 0 && row < matrixSize && column >= 0 && column < matrixSize;
}

function getVerticalOffset(direction: Direction): number {
    switch (direction) {
        case Direction.Up:
        case Direction.TopLeft:
        case Direction.TopRight:
            return -1;
        case Direction.Down:
        case Direction.BottomLeft:
        case Direction.BottomRight:
            return 1;
        default:
            return 0;
    }
}

function getHorizontalOffset(direction: Direction): number {
    switch (direction) {
        case Direction.Left:
        case Direction.TopLeft:
        case Direction.BottomLeft:
            return -1;
        case Direction.Right:
        case Direction.TopRight:
        case Direction.BottomRight:
            return 1;
        default:
            return 0;
    }
}



```

## playground\components\simulated-hardwares\modules\neopixel-display\NeoPixelViewModel.tsx

**Size:** 5297 bytes  
**Language:** typescript

```typescript
// NeoPixelViewModel.tsx
import {useEffect, useRef, useState} from "react";
import {calculateMove, isValidPosition} from "./NeoPixelUtils";
import {ControllerType, Direction, MatrixType, TestCase} from "./types";
import {NeopixelMatrixElement} from "@wokwi/elements";
import {RGB} from "@wokwi/elements/dist/cjs/types/rgb";
import {usePlayground} from "@/features/playground/providers/playground.provider";
import _ from 'lodash'
import neopixelBlockConfig
    from "@/features/playground/components/simulated-hardwares/modules/neopixel-display/neopixelBlockConfig";
import {useModuleBaseViewModel} from "@/features/playground/components/simulated-hardwares/modules/neopixel-display/ModuleBaseViewModel";


interface NeoPixelViewModelProps {
    matrixSize: number;
    matrixType: MatrixType;
    controllerType: ControllerType;
    testCase: TestCase;
}


export const useNeoPixelViewModel = ({matrixSize, matrixType, testCase, controllerType}: NeoPixelViewModelProps) => {

    const {getJsCode} = usePlayground();
    const row = 0, column = 1;
    const initialState = testCase.initialState[0];
    const neoPixelDisplayRef = useRef<NeopixelMatrixElement>(null);
    const startingPosition = [initialState[row], initialState[column]];
    const [animation, setAnimation] = useState<boolean>(false);
    let position = [...startingPosition];
    let actualPixelPath: any[] = [];

    const {executeCode,getCompletionStatus} = useModuleBaseViewModel()

    useEffect(() => {

        initDisplay();
        if (controllerType === ControllerType.keyboard) window.addEventListener("keydown", handleKeyboardEvents);
        return () => {
            window.removeEventListener("keydown", handleKeyboardEvents);
        };
    }, []);

    function handleKeyboardEvents(event: KeyboardEvent) {
        event.preventDefault()
        switch (event.key) {
            case "ArrowUp":
                move(Direction.Up);
                break;
            case "ArrowDown":
                move(Direction.Down);
                break;
            case "ArrowLeft":
                move(Direction.Left);
                break;
            case "ArrowRight":
                move(Direction.Right);
                break;
            default:
                break;
        }
    }



    function handleCodeCompletion() {
        if(actualPixelPath.length===0) return handleFailure()
        let expectedPixelPath = getExpectedPath()
        const result = getCompletionStatus(expectedPixelPath,actualPixelPath)
        if(result.status) handleSuccess()
        else handleFailure()
    }

    function executeBlockCode() {
        executeCode([move],['move'],handleCodeCompletion)
    }


    function initDisplay() {
        neoPixelDisplayRef.current?.reset();
        position = [...startingPosition];
        actualPixelPath = []
        testCase.initialState.forEach((position: number[]) => {
            setPixelWithColor(position, getRandomColor());
        });
    }

    function handleSuccess() {
        alert('success')
        initDisplay();
        console.log('move to next level!')
        // moveToNextLevel('next level id')
    }

    function handleFailure() {
        alert('failed')
        initDisplay();
    }

    function move(direction: Direction): void {
        const newPosition = calculateMove(direction, position);
        console.log(`[${String(newPosition)}],`)

        if (!isValidPosition(newPosition[row], newPosition[column], matrixSize)) {
            console.log("invalid move!");
            handleFailure()
            return;
        }
        position[row] = newPosition[row];
        position[column] = newPosition[column];
        actualPixelPath.push([...position])
        setPixel(position);
    }

    function getExpectedPath(): any[] {

        switch (matrixType) {
            case MatrixType.BI_DIRECTIONAL:
                const matchingPath = testCase.expectedOutput.find((path) =>
                    isPixelEqual(actualPixelPath[0], path[0])
                );
                if (matchingPath) return matchingPath;
                return [];
            case MatrixType.UNI_DIRECTIONAL:
                return testCase.expectedOutput;
            default:
                break;
        }
        return [];
    }


    function isPixelEqual(actualPosition: number[], expectedPosition: any) {
        return actualPosition.every(
            (value, index) => value === expectedPosition[index]
        );
    }

    function setPixel(position: number[]) {
        neoPixelDisplayRef.current?.setPixel(position[row], position[column], {
            r: 117,
            g: 195,
            b: 141,
        });
    }

    const colors: RGB[] = [
        {r: 188, g: 106, b: 102},
        {r: 190, g: 104, b: 170},
        {r: 117, g: 195, b: 141},
        {r: 106, g: 168, b: 194},
        {r: 131, g: 115, b: 195},
    ];

    function getRandomColor(): RGB {
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    }

    function setPixelWithColor(position: number[], color: RGB) {
        neoPixelDisplayRef.current?.setPixel(
            position[row],
            position[column],
            color
        );
    }

    return {neoPixelDisplayRef, animation, executeBlockCode};
};

```

## playground\components\simulated-hardwares\modules\neopixel-display\types.ts

**Size:** 603 bytes  
**Language:** typescript

```typescript
// types.ts
export interface Position {
    row: number;
    column: number;
}

export enum Direction {
    Up = 'Up',
    Down = 'Down',
    Left = 'Left',
    Right = 'Right',
    TopLeft = 'TopLeft',
    TopRight = 'TopRight',
    BottomLeft = 'BottomLeft',
    BottomRight = 'BottomRight',
    Stop = 'Stop',
}

export interface TestCase {
    initialState: number[][];
    expectedOutput: number[][] | number[][][];
}

export enum MatrixType {
    UNI_DIRECTIONAL='UNI_DIRECTIONAL',
    BI_DIRECTIONAL='BI_DIRECTIONAL'
}

export enum ControllerType{
    keyboard='keyboard',
    blocks='blocks',
}

```

## playground\components\simulated-hardwares\modules\servo-motor\servoModuleBlockConfig.ts

**Size:** 1927 bytes  
**Language:** typescript

```typescript
import blockKeys from "@/utils/playground/workspace/blocks/blockKeys";
import BlockKeys from "@/utils/playground/workspace/blocks/blockKeys";
// @ts-ignore
import {getSimpleToolboxBlock} from "@/utils/playground/workspace/blocks/blocks";
import {Modules} from "@/features/playground/components/simulated-hardwares/utils/modulesMap";
import {getModuleState} from "@/features/playground/components/simulated-hardwares/utils/commonUtils";

//block definitions
const blockDefinitions = {

    [BlockKeys.turnServoRight]: {
        "type": blockKeys.turnServoRight,
        "message0": "Turn servo right",
        "previousStatement": null,
        "nextStatement": null,
"colour": '#eaa8a8',
        "tooltip": "",
        "helpUrl": ""
    },
    [BlockKeys.turnServoLeft]: {
        "type": blockKeys.turnServoLeft,
        "message0": "Turn servo left",
        "previousStatement": null,
        "nextStatement": null,
"colour": '#eaa8a8',
        "tooltip": "",
        "helpUrl": ""
    }


}

//toolbox blocks
const toolbox = [
    blockKeys.turnServoLeft,
    blockKeys.turnServoRight,
]


//code generator
const codeGenerator = {
    [blockKeys.turnServoRight]: () => turnServo(ServoDirection.Right),
    [blockKeys.turnServoLeft]: () => turnServo(ServoDirection.Left),
};




enum ServoDirection {
    Right,
    Left
}

function turnServo(direction:ServoDirection){
    switch (direction){
        case ServoDirection.Right:
            return getServoBlockCode('+');
        case ServoDirection.Left:
            return getServoBlockCode('-')
    }
}

function getServoBlockCode(operator:string){
    return `await delay(500);
    degree = (degree ${operator} 45) % 360
    \nawait changeState(${getModuleState(Modules.ServoModule, `{angle:degree}`)});\n`
}

const servoBlockConfig = {
    blockDefinitions: blockDefinitions,
    toolBox: toolbox,
    jsCodeGenerator: codeGenerator
}

export default servoBlockConfig


```

## playground\components\simulated-hardwares\modules\servo-motor\ServoMotor.tsx

**Size:** 301 bytes  
**Language:** typescript

```typescript
import {FC} from "react";


export interface ServoState{
    angle:number;
}

export const ServoMotor: FC<ServoState> = ({angle}) => {
    return (
        <div className={'flex flex-col items-center p-2 m-2'}>
            <wokwi-servo horn="single" angle={angle}></wokwi-servo>
        </div>
    )
}
```

## playground\components\simulated-hardwares\utils\codeProcessor.ts

**Size:** 3617 bytes  
**Language:** typescript

```typescript
import _ from "lodash";
import {usePlayground} from "@/features/playground/providers/playground.provider";
import {delay} from "@/features/playground/components/simulated-hardwares/utils/commonUtils";


interface CallbackHandler {
    onFailure: (message: string) => void,
    onSuccess: (message: string) => void
}

const defaultCallbacks: CallbackHandler = {
    onFailure: (message: string) => {
    },
    onSuccess: (message: string) => {
    }
}

export const defaultStateChangeMethodName = 'changeState'

export async function runTestCases(additionalArgs: object = {}, code: string, testCases: any[], stateUpdater: (state: any) => void
    , callbackHandler: CallbackHandler = defaultCallbacks) {
    let actualState: any[] = []
    let completedTestCases = 0;
    let isFailed = false;

    for (let testcase of testCases) {
        const functionArgs =
            {...additionalArgs, ...testcase.inputs, [defaultStateChangeMethodName]: changeState}
        await executeCode(functionArgs, code, handleCodeCompletion)

    }

    function handleCodeCompletion() {
        processResult(actualState, testCases[completedTestCases].expectedOutput, onFailure, onSuccess)
    }

    function getStateChangeMethodArg(state: Function) {
        //TODO implement this hardcode check !
        if (state.name != defaultStateChangeMethodName) return console.log('please supply stateChangeMethod name as **changeState** as params are hardcoded')
        return {[defaultStateChangeMethodName]: state}
    }

    function changeState(state: any) {
        if (isFailed) return
        actualState.push(state)
        stateUpdater(state)
    }

    function onFailure(message: string) {
        console.log(message)
        if (isFailed) return
        callbackHandler.onFailure(message)
        resetModule()
        isFailed = true
    }


    function onSuccess(message: string) {
        console.log(message)
        actualState = []
        completedTestCases++;
        if (testCases.length === completedTestCases) {
            console.log('All test cases passed!')
            callbackHandler.onSuccess(message)
            resetModule()
            return
        }
        stateUpdater(testCases[completedTestCases].initialState)
    }

    function resetModule() {
        stateUpdater(testCases[0].initialState)
    }

}


export function processResult(actualState: any[], expectedStates: any[], onFailure: (message: string) => void, onSuccess: (message: string) => void) {
    if (actualState.length === 0) return onFailure('No code to execute!')
    if (expectedStates.length === 0 || actualState.length != expectedStates.length) return onFailure('Steps are not equal!')
    if (_.isEqual(actualState, expectedStates)) return onSuccess('Success')
    else return onFailure('Step mismatched!');
}


export async function executeCode(additionalExecCodeArgs: any, code: string, completionHandler: () => void) {
    const functions: any[] = []
    const args: string[] = []
    for (let key in additionalExecCodeArgs) {
        functions.push(additionalExecCodeArgs[key])
        args.push(key)
    }
    if (code != '') {
        let completionHandlerName = 'handleCodeCompletion'
        if (completionHandler.name != completionHandlerName) {
            console.log("please supply codeCompletionHandler function name as **handleCodeCompletion** as params are hardcoded")
            return
        }
        const execute = new Function(...args, 'handleCodeCompletion', code)
        await execute(...functions, completionHandler);
    } else console.log('no code found from Js block code generator!')

}




```

## playground\components\simulated-hardwares\utils\commonUtils.ts

**Size:** 369 bytes  
**Language:** typescript

```typescript
import {Modules} from "@/features/playground/components/simulated-hardwares/utils/modulesMap";

export const delay = (ms:number) => new Promise(resolve => setTimeout(resolve, ms));

export const getModuleState = (module:Modules,payload:any)=>{
    if(typeof payload === 'string') return `{'${module}':${payload}}`
    return `{'${module}':${JSON.stringify(payload)}}`
}
```

## playground\components\simulated-hardwares\utils\modulesMap.tsx

**Size:** 3167 bytes  
**Language:** typescript

```typescript
'use client'
import {
    NeoPixelDirect
} from "@/features/playground/components/simulated-hardwares/modules/neopixel-display/NeoPixelDirect";
import {Buzzer} from "@/features/playground/components/simulated-hardwares/modules/buzzer/Buzzer";
import React, {FC, useState} from "react";
import {usePlayground} from "@/features/playground/providers/playground.provider";
import {
    runTestCases
} from "@/features/playground/components/simulated-hardwares/utils/codeProcessor";
import {Button} from "@/features/common/components/button/Button";
import {Led} from "@/features/playground/components/simulated-hardwares/modules/led/Led";
import {ServoMotor} from "@/features/playground/components/simulated-hardwares/modules/servo-motor/ServoMotor";
import {Block} from "blockly";
import Blockly from "blockly/core";
import {LCD} from "@/features/playground/components/simulated-hardwares/modules/LCD/LCD";
import {Zap} from "lucide-react";

export enum Modules {
    NeoPixelModule = 'neo-pixel-module',
    LedModule = 'led-module',
    NoModule = 'no-module',
    BuzzerModule = 'buzzer-module',
    ServoModule = 'servo-module',
    LCDModule = 'lcd-module'

}

export function getModule(module: Modules = Modules.NoModule, runnerConfig: any) {
    switch (module) {
        case Modules.NeoPixelModule:
            return <NeoPixelDirect  {...runnerConfig}/>
        case Modules.LedModule:
            return <Led {...runnerConfig}/>
        case Modules.BuzzerModule:
            return <Buzzer {...runnerConfig}/>
        case Modules.ServoModule:
            return <ServoMotor {...runnerConfig}/>
        case Modules.LCDModule:
            return <LCD {...runnerConfig}/>
    }
}


interface ModuleProps {
    runnerConfig: any;
}


export const Module: FC<ModuleProps> = ({runnerConfig}) => {
    console.log(runnerConfig, 'runnerConfig')
    const {getJsCode} = usePlayground();
    const [moduleState, setModuleState] = useState(runnerConfig.moduleConfig.testCases[0].initialState)

    function updateState(state: any) {
        setModuleState((prevState: any) => {
            return {
                ...prevState,
                ...state
            };
        });

    }

    function runCode() {
        runTestCases({}, getJsCode(), runnerConfig.moduleConfig.testCases, updateState).then(r => console.log(r))
    }


    return (
        <div className={'flex flex-col items-center p-2 m-2'}>
            {
                runnerConfig.moduleNames.map((module: Modules) => {
                    return <div key={module}> {getModule(module, moduleState[module])}</div>
                })
            }
            <RunButton onClick={runCode}/>

        </div>
    )
}


type ButtonProps = {
    onClick: () => void; // Callback function for button click
};

const RunButton: FC<ButtonProps> = ({onClick}) => {
    return (
        <button
            className="bg-green-400 ml-2 mt-2 hover:bg-green-500 text-white px-4 py-2 rounded-md flex items-center shadow-md transition duration-200"

            onClick={onClick}
        >
            <Zap size={16} className="mr-2"/>
            RUN
        </button>
    );
};

export default RunButton;


```

## playground\hardware-map.ts

**Size:** 1090 bytes  
**Language:** typescript

```typescript
import { Modules } from '@/features/playground/components/simulated-hardwares/utils/modulesMap';
import NeopixelBlockConfig from '@/features/playground/components/simulated-hardwares/modules/neopixel-display/neopixelBlockConfig';
import LedModuleBlockConfig from '@/features/playground/components/simulated-hardwares/modules/led/ledModuleBlockConfig';
import BuzzerModuleBlockConfig from '@/features/playground/components/simulated-hardwares/modules/buzzer/buzzerModuleBlockConfig';
import ServoModuleBlockConfig from '@/features/playground/components/simulated-hardwares/modules/servo-motor/servoModuleBlockConfig';

export const hardwareMap: { [key: string]: any } = {
    'neopixel': {
        module: Modules.NeoPixelModule,
        blockConfig: NeopixelBlockConfig,
    },
    'led': {
        module: Modules.LedModule,
        blockConfig: LedModuleBlockConfig,
    },
    'buzzer': {
        module: Modules.BuzzerModule,
        blockConfig: BuzzerModuleBlockConfig,
    },
    'servo': {
        module: Modules.ServoModule,
        blockConfig: ServoModuleBlockConfig,
    },
};

```

## playground\providers\playground.provider.tsx

**Size:** 2963 bytes  
**Language:** typescript

```typescript
import {createContext, FC, PropsWithChildren, useContext, useState} from "react";
import {Playground} from "@/utils/playground/playground";
import {ToolboxContainer} from "@/utils/playground/workspace/toolbox/toolboxContainer";
import {
    GlobalPGCommChannel,
    PlaygroundCommunicationChannel, RegisterPlaygroundComponent
} from "@/utils/pg-comm-channel.util";

interface PlaygroundContextProps {
    playground: Playground | null;
    initPlayground: (element: HTMLDivElement, toolbox: any) => void;
    runCode: () => void;
    getJsCode: () => string;
    connect: () => void;
    registerComponent: RegisterPlaygroundComponent;
    isDeviceConnected: boolean;
}


const PlaygroundContext = createContext<PlaygroundContextProps>({
    playground: null,
    initPlayground: () => null,
    runCode: () => null,
    getJsCode: () => '',
    connect: () => null,
    registerComponent: () => null,
    isDeviceConnected: false,
});

export const PlaygroundProvider: FC<PropsWithChildren> = ({children}) => {


    const [playgroundInstance, setPlaygroundInstance] = useState<Playground | null>(null);
    const initPlayground = (element: HTMLDivElement, toolbox: any) => {
        setPlaygroundInstance(new Playground(element, toolbox));
    }
    const [isDeviceConnected, setIsDeviceConnected] = useState(false)

    function getJsCode(): string {
        if (playgroundInstance) {
            return playgroundInstance.getJsCode();
        }
        return ''
    }

    const runCode = () => {
        if (playgroundInstance) {
            if (isDeviceConnected){
                playgroundInstance.generateExecPyCode();
                // playgroundInstance.generateExecJsCode();
            }else {
                alert("Please Connect device! If already connected please try reconnecting.")
            }

        }
    }

    const connect = async () => {
        if (playgroundInstance) {
            try {
                const result = await playgroundInstance.connectToDevice(onDisconnect)
                console.log(result,';')
                setIsDeviceConnected(result)

            } catch (e) {
                setIsDeviceConnected(false);
                console.log('e', e);
            }
        }
    };

    function onDisconnect(){
        setIsDeviceConnected(false)
    }



    const registerComponent: RegisterPlaygroundComponent = (key, callback: (data: any) => void) => {
        // @ts-ignore
        (window[GlobalPGCommChannel] as PlaygroundCommunicationChannel).registerComponent(key, callback);
    }

    return (
        <PlaygroundContext.Provider value={{
            playground: playgroundInstance,
            initPlayground,
            runCode,
            getJsCode,
            connect,
            registerComponent,
            isDeviceConnected
        }}>
            {children}
        </PlaygroundContext.Provider>
    )
}


export const usePlayground = () => {
    return useContext(PlaygroundContext);
}

```

## playground\providers\SH.provider.tsx

**Size:** 3236 bytes  
**Language:** typescript

```typescript
import {
    GlobalPGCommChannel,
    PlaygroundCommunicationChannel,
    RegisterPlaygroundComponent,
    resetMessageQueue
} from "@/utils/pg-comm-channel.util";
import {createContext, FC, PropsWithChildren, useContext} from "react";
import _ from 'lodash';


interface SHContextProps {
    registerComponent: RegisterPlaygroundComponent;
    initCode: (data: any) => boolean;
    initialUiState: any,
    updateUiState: (componentKey: string, updatedUiState: any) => void;
    checkCompletionStatus: (data: any, successCallback: () => void, failureCallback: () => void) => boolean;
    stopCode: () => void

}

interface ComponentConfigProp {
    initialUiState: any;
    desiredUiState: any;
}

const ShContext = createContext<SHContextProps>({
    registerComponent: () => null,
    initialUiState: null,
    updateUiState: () => null,
    checkCompletionStatus: () => false,
    stopCode: () => null,
    initCode: () => true
});

export const SHProvider: FC<PropsWithChildren<ComponentConfigProp>> = ({initialUiState, desiredUiState, children}) => {

    let uiState = {...initialUiState};
    const codeProgress: any = []
    let step = -1


    function checkCompletionStatus(data: any, successCallback: () => void, failureCallback: () => void): boolean {
        step++
        if (isCodeCompleted(data)) {
            stopCode()
            successCallback()
            return true
        }
        if(!isStepValid(data)){
            stopCode()
            failureCallback()
            return true;
        }

        return false;
    }

    function isStepValid(currentStep: any): boolean {
        let potentialSteps = desiredUiState[step];
        for (let potentialStepIndex = 0; potentialStepIndex < potentialSteps.length; potentialStepIndex++) {
            let potentialStep = potentialSteps[potentialStepIndex];
            if (_.isEqual(currentStep, potentialStep)) {
                return true
            }
        }
        return false;
    }


    //TODO
    //remove this and check
    function updateUiState(componentKey: string, updatedUiState: any) {
        uiState = {...initialUiState, ...{[componentKey]: {...initialUiState[componentKey], ...updatedUiState}}};
        codeProgress.push(uiState)
    }

    //TODO
    //check if any program need init
    function initCode(data: any): boolean {
        return data.hasOwnProperty('init')

    }


    function isOnDesiredState(): boolean {
        return _.isEqual(desiredUiState, codeProgress);

    }

    function isCodeCompleted(data: any): boolean {
        return data.hasOwnProperty('completed')
    }

    function stopCode() {
        step=-1
        codeProgress.length = 0
        resetMessageQueue()
    }


    const registerComponent: RegisterPlaygroundComponent = (key, callback: (data: any) => void) => {
        // @ts-ignore
        (window[GlobalPGCommChannel] as PlaygroundCommunicationChannel).registerComponent(key, callback);
    }


    return (
        <ShContext.Provider
            value={{registerComponent, initialUiState, updateUiState, checkCompletionStatus, stopCode, initCode}}>
            {children}
        </ShContext.Provider>
    )
}

export const useShContext = () => {
    return useContext(ShContext);
}

```

## playground-container.content.ts

**Size:** 28080 bytes  
**Language:** typescript

```typescript
'use client'
import BlockKeys from "@/utils/playground/workspace/blocks/blockKeys";
import blockKeys from "@/utils/playground/workspace/blocks/blockKeys";
import {
    ControllerType,
    MatrixType
} from "@/features/playground/components/simulated-hardwares/modules/neopixel-display/types";
import {Modules} from "@/features/playground/components/simulated-hardwares/utils/modulesMap";
import NeopixelBlockConfig
    from "@/features/playground/components/simulated-hardwares/modules/neopixel-display/neopixelBlockConfig";
import LedModuleBlockConfig from "@/features/playground/components/simulated-hardwares/modules/led/ledModuleBlockConfig";
import BuzzerModuleBlockConfig
    from "@/features/playground/components/simulated-hardwares/modules/buzzer/buzzerModuleBlockConfig";
import ServoModuleBlockConfig
    from "@/features/playground/components/simulated-hardwares/modules/servo-motor/servoModuleBlockConfig";
import ModuleConfigConstants
    from "@/features/playground/components/simulated-hardwares/modules/common/moduleConfigConstants";

export const PlaygroundContainerContent = [

    // Introduction to Pixel Movement
    {
        chapterId: 1,
        type: 'content',
        content: {
            contentId: 0,
            title: "Your First Pixel Move",
            description: "Welcome to the playground! Let's start by moving a pixel one step to the left. This simple movement is your first step into the world of programming.",
            media: [
                {
                    type: "video",
                    url: "",
                    caption: ""
                }
            ]
        },
        editorConfig: {
            toolboxType: 'flyoutToolbox',
            toolboxContent: [BlockKeys.moveLeft],
        },
        runnerConfig: {
            moduleName: Modules.NeoPixelModule,
            moduleConfig: {
                matrixSize: 11,
                matrixType: MatrixType.UNI_DIRECTIONAL,
                testCase: {
                    initialState: [[5, 5]],
                    expectedOutput: [[5, 4]],
                },
                controllerType: ControllerType.blocks
            }
        }
    },

    {
        chapterId: 2,
        type: 'content',
        content: {
            contentId: 0,
            title: "Pixels in Motion: Up and Down",
            description: "Let's explore more directions! Move your pixel one step up and see how coordinates change on the display. Understanding directional movement is a fundamental programming skill.",
            media: [
                {
                    type: "video",
                    url: "",
                    caption: ""
                }
            ]
        },
        editorConfig: {
            toolboxType: 'flyoutToolbox',
            toolboxContent: [blockKeys.moveUp],
        },
        runnerConfig: {
            moduleName: Modules.NeoPixelModule,
            moduleConfig: {
                matrixSize: 11,
                matrixType: MatrixType.UNI_DIRECTIONAL,
                testCase: {
                    initialState: [[5, 5]],
                    expectedOutput: [[4, 5]],
                },
                controllerType: ControllerType.blocks
            }
        }
    },

    {
        chapterId: 3,
        type: 'content',
        content: {
            contentId: 0,
            title: "Downward Bound",
            description: "Now let's move in the opposite direction. Send your pixel one step down and observe how the position changes. Notice how we're using coordinates to track position!",
            media: [
                {
                    type: "video",
                    url: "",
                    caption: ""
                }
            ]
        },
        editorConfig: {
            toolboxType: 'flyoutToolbox',
            toolboxContent: [blockKeys.moveDown],
        },
        runnerConfig: {
            moduleName: Modules.NeoPixelModule,
            moduleConfig: {
                matrixSize: 11,
                matrixType: MatrixType.UNI_DIRECTIONAL,
                testCase: {
                    initialState: [[5, 5]],
                    expectedOutput: [[6, 5]],
                },
                controllerType: ControllerType.blocks
            }
        }
    },

    {
        chapterId: 4,
        type: 'content',
        content: {
            contentId: 0,
            title: "Triple Jump Right",
            description: "Let's stretch our abilities! Move your pixel three steps to the right in one go. This challenge introduces the concept of moving multiple units at once.",
            media: [
                {
                    type: "video",
                    url: "",
                    caption: ""
                }
            ]
        },
        editorConfig: {
            toolboxType: 'flyoutToolbox',
            toolboxContent: [blockKeys.moveRight],
        },
        runnerConfig: {
            moduleName: Modules.NeoPixelModule,
            moduleConfig: {
                matrixSize: 11,
                matrixType: MatrixType.UNI_DIRECTIONAL,
                testCase: {
                    initialState: [[5, 5]],
                    expectedOutput: [[5, 6], [5, 7], [5, 8]]
                },
                controllerType: ControllerType.blocks
            }
        }
    },

    // Loops and Patterns
    {
        chapterId: 5,
        type: 'content',
        content: {
            contentId: 0,
            title: "Blink Repeat",
            description: "Let's make an LED blink exactly twice! This introduces you to the power of repetition in programming - doing the same action multiple times without writing duplicate code.",
            media: [
                {
                    type: "video",
                    url: "",
                    caption: ""
                }
            ]
        },
        editorConfig: {
            toolboxType: 'flyoutToolbox',
            toolboxContent: [blockKeys.blinkLed],
        },
        runnerConfig: {
            moduleNames: [Modules.LedModule],
            moduleConfig: {
                testCases: [
                    {
                        inputs: {},
                        initialState: {[Modules.LedModule]: {active: false, color: 'red'}},
                        expectedOutput: [{
                            [Modules.LedModule]: {
                                active: true,
                                color: 'red'
                            }
                        }, {[Modules.LedModule]: {active: false, color: 'red'}}, {
                            [Modules.LedModule]: {
                                active: true,
                                color: 'red'
                            }
                        }, {[Modules.LedModule]: {active: false, color: 'red'}},]
                    },
                ]
            }
        }
    },

    {
        chapterId: 6,
        type: 'content',
        content: {
            contentId: 0,
            title: "The L-Shape Challenge",
            description: "Create an L-shape pattern by moving 5 steps down and then 5 steps right from your starting position. This pattern introduces sequential commands to create specific shapes.",
            media: [
                {
                    type: "video",
                    url: "",
                    caption: ""
                }
            ]
        },
        editorConfig: {
            toolboxType: 'flyoutToolbox',
            toolboxContent: [blockKeys.moveRight, blockKeys.moveDown],
        },
        runnerConfig: {
            moduleName: Modules.NeoPixelModule,
            moduleConfig: {
                matrixSize: 11,
                matrixType: MatrixType.UNI_DIRECTIONAL,
                testCase: {
                    initialState: [[5, 5]],
                    expectedOutput: [[6, 5], [7, 5], [8, 5], [9, 5], [10, 5], [10, 6], [10, 7], [10, 8], [10, 9], [10, 10],]
                },
                controllerType: ControllerType.blocks
            }
        }
    },

    {
        chapterId: 7,
        type: 'content',
        content: {
            contentId: 0,
            title: "L-Shape with Loops",
            description: "Now recreate the same L-shape pattern, but this time using loops to make your code more efficient. See how loops can simplify repetitive tasks!",
            media: [
                {
                    type: "video",
                    url: "",
                    caption: ""
                }
            ]
        },
        editorConfig: {
            toolboxType: 'flyoutToolbox',
            toolboxContent: [blockKeys.moveRight, blockKeys.moveDown, blockKeys.controlsRepeat],
        },
        runnerConfig: {
            moduleName: Modules.NeoPixelModule,
            moduleConfig: {
                matrixSize: 11,
                matrixType: MatrixType.UNI_DIRECTIONAL,
                testCase: {
                    initialState: [[5, 5]],
                    expectedOutput: [[6, 5], [7, 5], [8, 5], [9, 5], [10, 5], [10, 6], [10, 7], [10, 8], [10, 9], [10, 10],]
                },
                controllerType: ControllerType.blocks
            }
        }
    },

    // Multiple Pixels and Complex Patterns
    {
        chapterId: 8,
        type: 'content',
        content: {
            contentId: 0,
            title: "Join the Dots",
            description: "Connect two pixels with a continuous line. This introduces you to thinking about the path between two points - a fundamental concept in graphics programming.",
            media: [
                {
                    type: "video",
                    url: "",
                    caption: ""
                }
            ]
        },
        editorConfig: {
            toolboxType: 'flyoutToolbox',
            toolboxContent: [...NeopixelBlockConfig.toolBox, BlockKeys.controlsRepeat],
        },
        runnerConfig: {
            moduleName: Modules.NeoPixelModule,
            moduleConfig: {
                matrixSize: 11,
                matrixType: MatrixType.BI_DIRECTIONAL,
                testCase: {
                    initialState: [[5, 5], [10, 10]],
                    expectedOutput: [
                        [[6, 5], [7, 5], [8, 5], [9, 5], [10, 5], [10, 6], [10, 7], [10, 8], [10, 9], [10, 10]],
                        [[5, 6], [5, 7], [5, 8], [5, 9], [5, 10], [6, 10], [7, 10], [8, 10], [9, 10], [10, 10]]
                    ]
                },
                controllerType: ControllerType.blocks
            }
        }
    },

    {
        chapterId: 9,
        type: 'content',
        content: {
            contentId: 0,
            title: "Perfect Square",
            description: "Create a square by connecting two diagonal pixels. This challenge teaches you to think about closed shapes and how to track your position as you create a pattern.",
            media: [
                {
                    type: "video",
                    url: "",
                    caption: ""
                }
            ]
        },
        editorConfig: {
            toolboxType: 'flyoutToolbox',
            toolboxContent: [...NeopixelBlockConfig.toolBox, BlockKeys.controlsRepeat],
        },
        runnerConfig: {
            moduleName: Modules.NeoPixelModule,
            moduleConfig: {
                matrixSize: 11,
                matrixType: MatrixType.BI_DIRECTIONAL,
                testCase: {
                    initialState: [[5, 5], [10, 10]],
                    expectedOutput: [
                        [[6, 5], [7, 5], [8, 5], [9, 5], [10, 5], [10, 6], [10, 7], [10, 8], [10, 9], [10, 10], [9, 10], [8, 10], [7, 10], [6, 10], [5, 10], [5, 9], [5, 8], [5, 7], [5, 6], [5, 5]],
                        [[5, 6], [5, 7], [5, 8], [5, 9], [5, 10], [6, 10], [7, 10], [8, 10], [9, 10], [10, 10], [10, 9], [10, 8], [10, 7], [10, 6], [10, 5], [9, 5], [8, 5], [7, 5], [6, 5], [5, 5]]
                    ]
                },
                controllerType: ControllerType.blocks
            }
        }
    },

    {
        chapterId: 10,
        type: 'content',
        content: {
            contentId: 0,
            title: "Connect the Squares",
            description: "Join two adjacent squares by connecting their vertices. This advanced pattern challenges you to think about complex pathways and efficient movement strategies.",
            media: [
                {
                    type: "video",
                    url: "",
                    caption: ""
                }
            ]
        },
        editorConfig: {
            toolboxType: 'flyoutToolbox',
            toolboxContent: [...NeopixelBlockConfig.toolBox, BlockKeys.controlsRepeat],
        },
        runnerConfig: {
            moduleName: Modules.NeoPixelModule,
            moduleConfig: {
                matrixSize: 11,
                matrixType: MatrixType.BI_DIRECTIONAL,
                testCase: {
                    initialState: [[5, 5], [10, 10], [0, 0]],
                    expectedOutput: [
                        [[6, 5], [7, 5], [8, 5], [9, 5], [10, 5], [10, 6], [10, 7], [10, 8], [10, 9], [10, 10], [9, 10], [8, 10], [7, 10], [6, 10], [5, 10], [5, 9], [5, 8], [5, 7], [5, 6], [5, 5], [5, 4], [5, 3], [5, 2], [5, 1], [5, 0], [4, 0], [3, 0], [2, 0], [1, 0], [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5]],
                    ]
                },
                controllerType: ControllerType.blocks
            }
        }
    },

    // Hardware Control Basics
    {
        chapterId: 11,
        type: 'content',
        content: {
            contentId: 0,
            title: "Light It Up!",
            description: "Turn on an LED with a single command. This introduces you to controlling physical components - the foundation of electronics programming.",
            media: [
                {
                    type: "video",
                    url: "",
                    caption: ""
                }
            ]
        },
        editorConfig: {
            toolboxType: 'flyoutToolbox',
            toolboxContent: [blockKeys.turnOnLed],
        },
        runnerConfig: {
            moduleNames: [Modules.LedModule],
            moduleConfig: {
                testCases: [
                    {
                        inputs: {},
                        initialState: {[Modules.LedModule]: {active: false, color: 'red'}},
                        expectedOutput: [{[Modules.LedModule]: {active: true, color: 'red'}}]
                    },
                ]
            }
        }
    },

    {
        chapterId: 12,
        type: 'content',
        content: {
            contentId: 0,
            title: "Precise Motion Control",
            description: "Rotate a servo motor right twice by 45 degrees each time. Learn how to control precise movements - essential for robotics and mechanical projects.",
            media: [
                {
                    type: "video",
                    url: "",
                    caption: ""
                }
            ]
        },
        editorConfig: {
            toolboxType: 'flyoutToolbox',
            toolboxContent: [...ServoModuleBlockConfig.toolBox],
        },
        runnerConfig: {
            moduleNames: [Modules.ServoModule],
            moduleConfig: {
                testCases: [
                    {
                        inputs: {degree: 0},
                        initialState: {[Modules.ServoModule]: {angle: 0}},
                        expectedOutput: [{[Modules.ServoModule]: {angle: 45}}, {[Modules.ServoModule]: {angle: 90}}]
                    },
                ]
            }
        }
    },

    {
        chapterId: 13,
        type: 'content',
        content: {
            contentId: 0,
            title: "Light and Motion",
            description: "Turn on an LED and then rotate a servo motor. This challenge teaches you to control multiple hardware components in sequence - a key skill for creating interactive projects.",
            media: [
                {
                    type: "video",
                    url: "",
                    caption: ""
                }
            ]
        },
        editorConfig: {
            toolboxType: 'flyoutToolbox',
            toolboxContent: [...LedModuleBlockConfig.toolBox, ...ServoModuleBlockConfig.toolBox],
        },
        runnerConfig: {
            moduleNames: [Modules.LedModule, Modules.ServoModule],
            moduleConfig: {
                testCases: [
                    {
                        inputs: {degree: 0},
                        initialState: {
                            [Modules.LedModule]: {active: false, color: 'red'},
                            [Modules.ServoModule]: {angle: 0}
                        },
                        expectedOutput: [{
                            [Modules.LedModule]: {
                                active: true,
                                color: 'red'
                            }
                        }, {[Modules.ServoModule]: {angle: 45}}]
                    },
                ]
            }
        }
    },

    // Conditional Logic
    {
        chapterId: 14,
        type: 'content',
        content: {
            contentId: 0,
            title: "Smart Lighting",
            description: "Turn on an LED only when the light sensor reads above 60. This introduces conditional logic - making decisions based on sensor input, which is fundamental to responsive programming.",
            media: [
                {
                    type: "video",
                    url: "",
                    caption: ""
                }
            ]
        },
        editorConfig: {
            toolboxType: 'flyoutToolbox',
            toolboxContent: [blockKeys.controlsIf, blockKeys.turnOffLed, blockKeys.turnOnLed, blockKeys.lightValue, blockKeys.mathNumber, blockKeys.logicCompare],
        },
        runnerConfig: {
            moduleNames: [Modules.LedModule],
            moduleConfig: {
                testCases: [
                    {
                        inputs: {lightValue: 40},
                        initialState: {[Modules.LedModule]: {active: false, color: 'red'}},
                        expectedOutput: [{[Modules.LedModule]: {active: false, color: 'red'}}]
                    },
                    {
                        inputs: {lightValue: 80},
                        initialState: {[Modules.LedModule]: {active: false, color: 'red'}},
                        expectedOutput: [{[Modules.LedModule]: {active: true, color: 'red'}}]
                    },
                ]
            }
        }
    },

    {
        chapterId: 15,
        type: 'content',
        content: {
            contentId: 0,
            title: "Responsive Blinking",
            description: "Make an LED blink twice when light level falls below 10, and turn it off when light level is above 10. This challenge combines conditions with actions to create responsive behavior.",
            media: [
                {
                    type: "video",
                    url: "",
                    caption: ""
                }
            ]
        },
        editorConfig: {
            toolboxType: 'flyoutToolbox',
            toolboxContent: [blockKeys.controlsIf, blockKeys.turnOffLed, blockKeys.turnOnLed, blockKeys.blinkLed, blockKeys.lightValue, blockKeys.mathNumber, blockKeys.logicCompare],
        },
        runnerConfig: {
            moduleNames: [Modules.LedModule, Modules.LCDModule],
            moduleConfig: {
                testCases: [
                    {
                        inputs: {lightValue: 20},
                        initialState: {
                            [Modules.LedModule]: {active: true, color: 'red'},
                            [Modules.LCDModule]: {text: '20'}
                        },
                        expectedOutput: [{[Modules.LedModule]: {active: false, color: 'red'}}]
                    },
                    {
                        inputs: {lightValue: 9},
                        initialState: {
                            [Modules.LedModule]: {active: true, color: 'red'},
                            [Modules.LCDModule]: {text: '9'}
                        },
                        expectedOutput: [{
                            [Modules.LedModule]: {
                                active: true,
                                color: 'red'
                            }
                        }, {[Modules.LedModule]: {active: false, color: 'red'}}, {
                            [Modules.LedModule]: {
                                active: true,
                                color: 'red'
                            }
                        }, {[Modules.LedModule]: {active: false, color: 'red'}}]
                    },
                ]
            }
        }
    },

    // Creative Challenges (New)
    {
        chapterId: 16,
        type: 'content',
        content: {
            contentId: 0,
            title: "Create Your Light Show",
            description: "Design a sequence where the LED blinks in a pattern based on rotating the servo to different positions. This open-ended challenge lets you combine everything you've learned so far!",
            media: [
                {
                    type: "video",
                    url: "",
                    caption: ""
                }
            ]
        },
        editorConfig: {
            toolboxType: 'flyoutToolbox',
            toolboxContent: [...LedModuleBlockConfig.toolBox, ...ServoModuleBlockConfig.toolBox, blockKeys.controlsRepeat, blockKeys.delay],
        },
        runnerConfig: {
            moduleNames: [Modules.LedModule, Modules.ServoModule],
            moduleConfig: {
                testCases: [
                    {
                        inputs: {degree: 0},
                        initialState: {
                            [Modules.LedModule]: {active: false, color: 'red'},
                            [Modules.ServoModule]: {angle: 0}
                        },
                        expectedOutput: [
                            {[Modules.ServoModule]: {angle: 45}},
                            {[Modules.LedModule]: {active: true, color: 'red'}},
                            {[Modules.LedModule]: {active: false, color: 'red'}},
                            {[Modules.ServoModule]: {angle: 90}},
                            {[Modules.LedModule]: {active: true, color: 'red'}},
                            {[Modules.LedModule]: {active: false, color: 'red'}},
                            {[Modules.ServoModule]: {angle: 135}},
                            {[Modules.LedModule]: {active: true, color: 'red'}},
                            {[Modules.LedModule]: {active: false, color: 'red'}}
                        ]
                    },
                ]
            }
        }
    },

    {
        chapterId: 17,
        type: 'content',
        content: {
            contentId: 0,
            title: "Pixel Race Challenge",
            description: "Move two pixels from opposite corners of the display and have them meet in the middle, then create a square expanding outward. This tests your ability to coordinate multiple moving elements.",
            media: [
                {
                    type: "video",
                    url: "",
                    caption: ""
                }
            ]
        },
        editorConfig: {
            toolboxType: 'flyoutToolbox',
            toolboxContent: [...NeopixelBlockConfig.toolBox, BlockKeys.controlsRepeat],
        },
        runnerConfig: {
            moduleName: Modules.NeoPixelModule,
            moduleConfig: {
                matrixSize: 11,
                matrixType: MatrixType.BI_DIRECTIONAL,
                testCase: {
                    initialState: [[0, 0], [10, 10]],
                    expectedOutput: [
                        // Path from [0,0] to [5,5]
                        [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5]],
                        // Path from [10,10] to [5,5]
                        [[9, 9], [8, 8], [7, 7], [6, 6], [5, 5]],
                        // Square expanding from center
                        [[4, 4], [4, 5], [4, 6], [5, 6], [6, 6], [6, 5], [6, 4], [5, 4], [4, 4]]
                    ]
                },
                controllerType: ControllerType.blocks
            }
        }
    },

    {
        chapterId: 18,
        type: 'content',
        content: {
            contentId: 0,
            title: "Smart Environment Monitor",
            description: "Create a system that displays different patterns on the NeoPixel display based on light sensor readings. Use the LED as an alert for extreme readings. This challenge brings together sensors, displays, and conditional logic!",
            media: [
                {
                    type: "video",
                    url: "",
                    caption: ""
                }
            ]
        },
        editorConfig: {
            toolboxType: 'flyoutToolbox',
            toolboxContent: [...NeopixelBlockConfig.toolBox, ...LedModuleBlockConfig.toolBox, blockKeys.controlsIf, blockKeys.lightValue, blockKeys.mathNumber, blockKeys.logicCompare],
        },
        runnerConfig: {
            moduleNames: [Modules.NeoPixelModule, Modules.LedModule],
            moduleConfig: {
                matrixSize: 11,
                matrixType: MatrixType.UNI_DIRECTIONAL,
                testCases: [
                    // Low light scenario
                    {
                        inputs: {lightValue: 5},
                        initialState: {
                            [Modules.NeoPixelModule]: {pixels: []},
                            [Modules.LedModule]: {active: false, color: 'red'}
                        },
                        expectedOutput: [
                            // Display "L" on NeoPixel
                            {[Modules.NeoPixelModule]: {pixels: [[2, 2], [3, 2], [4, 2], [5, 2], [5, 3], [5, 4]]}},
                            // Blink LED for warning
                            {[Modules.LedModule]: {active: true, color: 'red'}},
                            {[Modules.LedModule]: {active: false, color: 'red'}},
                            {[Modules.LedModule]: {active: true, color: 'red'}},
                            {[Modules.LedModule]: {active: false, color: 'red'}}
                        ]
                    },
                    // Medium light scenario
                    {
                        inputs: {lightValue: 50},
                        initialState: {
                            [Modules.NeoPixelModule]: {pixels: []},
                            [Modules.LedModule]: {active: false, color: 'red'}
                        },
                        expectedOutput: [
                            // Display "M" on NeoPixel
                            {[Modules.NeoPixelModule]: {pixels: [[2, 2], [2, 3], [2, 4], [3, 3], [4, 2], [4, 3], [4, 4]]}},
                            // LED stays off
                            {[Modules.LedModule]: {active: false, color: 'red'}}
                        ]
                    },
                    // High light scenario
                    {
                        inputs: {lightValue: 90},
                        initialState: {
                            [Modules.NeoPixelModule]: {pixels: []},
                            [Modules.LedModule]: {active: false, color: 'red'}
                        },
                        expectedOutput: [
                            // Display "H" on NeoPixel
                            {[Modules.NeoPixelModule]: {pixels: [[2, 2], [2, 3], [2, 4], [3, 3], [4, 2], [4, 3], [4, 4]]}},
                            // Turn on LED for warning
                            {[Modules.LedModule]: {active: true, color: 'red'}}
                        ]
                    }
                ]
            }
        }
    }
];
```

## playground-content.ts

**Size:** 8086 bytes  
**Language:** typescript

```typescript
export enum ProjectTypes {
    VIRTUAL,
    HARDWARE,
    CONTENT
}

export const ProjectsContent = {
    '1': {
        type: ProjectTypes.CONTENT,
        hwPlaygroundConfigId: '-1',
        content: {
            title: "Getting Started with the Kit",
            description: "A beginner-friendly guide to unpacking and using your electronics kit effectively.",
            media: {
                image: {
                    url: "https://picsum.photos/500/400",
                }
            }
            ,
            articleSections: [
                {
                    title: "1. Progressive Web Apps (PWAs)",
                    content: "Progressive Web Apps are becoming increasingly popular due to their ability to provide app-like experiences directly through web browsers. They offer offline functionality, push notifications, and fast loading times, blurring the line between web and native applications.",
                    imageUrl: "https://picsum.photos/500/400",
                },
                {
                    title: "2. WebAssembly",
                    content: "WebAssembly is revolutionizing web performance by allowing developers to run high-performance code in the browser. This opens up new possibilities for complex web applications, including games, video editing tools, and more.",
                    imageUrl: "https://picsum.photos/500/400",
                },
                {
                    title: "3. AI-Powered Development",
                    content: "Artificial Intelligence is making its way into web development, assisting developers with code generation, bug detection, and even design suggestions. This trend is set to significantly boost productivity and innovation in the field.",
                    imageUrl: "https://picsum.photos/500/400",
                }
            ]
        },

    },

    '2': {
        type: ProjectTypes.CONTENT,
        hwPlaygroundConfigId: '1',
        content: {
            title: "Connecting and Running the Setup",
            description: "Learn how to connect the kit components and run your first program.",
            media: {
                image: {
                    url: "https://picsum.photos/500/400",
                }
            }
            ,
            articleSections: [
                {
                    title: "1. Progressive Web Apps (PWAs)",
                    content: "Progressive Web Apps are becoming increasingly popular due to their ability to provide app-like experiences directly through web browsers. They offer offline functionality, push notifications, and fast loading times, blurring the line between web and native applications.",
                    imageUrl: "https://picsum.photos/500/400",
                },
                {
                    title: "2. WebAssembly",
                    content: "WebAssembly is revolutionizing web performance by allowing developers to run high-performance code in the browser. This opens up new possibilities for complex web applications, including games, video editing tools, and more.",
                    imageUrl: "https://picsum.photos/500/400",
                },
                {
                    title: "3. AI-Powered Development",
                    content: "Artificial Intelligence is making its way into web development, assisting developers with code generation, bug detection, and even design suggestions. This trend is set to significantly boost productivity and innovation in the field.",
                    imageUrl: "https://picsum.photos/500/400",
                }
            ]
        },

    },


    '3': {
        type: ProjectTypes.CONTENT,
        hwPlaygroundConfigId: '2',
        content: {
            title: "Light Up the Built-in LED",
            description: "Discover how to control the default LED and make it shine with your first command.",
            media: {
                image: {
                    url: "https://picsum.photos/500/400",
                }
            }
            ,
            articleSections: [
                {
                    title: "1. Progressive Web Apps (PWAs)",
                    content: "Progressive Web Apps are becoming increasingly popular due to their ability to provide app-like experiences directly through web browsers. They offer offline functionality, push notifications, and fast loading times, blurring the line between web and native applications.",
                    imageUrl: "https://picsum.photos/500/400",
                },
                {
                    title: "2. WebAssembly",
                    content: "WebAssembly is revolutionizing web performance by allowing developers to run high-performance code in the browser. This opens up new possibilities for complex web applications, including games, video editing tools, and more.",
                    imageUrl: "https://picsum.photos/500/400",
                },
                {
                    title: "3. AI-Powered Development",
                    content: "Artificial Intelligence is making its way into web development, assisting developers with code generation, bug detection, and even design suggestions. This trend is set to significantly boost productivity and innovation in the field.",
                    imageUrl: "https://picsum.photos/500/400",
                }
            ]
        },

    },

    '4': {
        type: ProjectTypes.CONTENT,
        hwPlaygroundConfigId: '3',
        content: {
            title: "Turning Off the LED",
            description: "Master the basics of turning off the built-in LED with simple commands.",
            media: {
                image: {
                    url: "https://picsum.photos/500/400",
                }
            },
            articleSections: [
                {
                    title: "1. Progressive Web Apps (PWAs)",
                    content: "Progressive Web Apps are becoming increasingly popular due to their ability to provide app-like experiences directly through web browsers. They offer offline functionality, push notifications, and fast loading times, blurring the line between web and native applications.",
                    imageUrl: "https://picsum.photos/500/400",
                },],
        },

    },
    '5': {
        type: ProjectTypes.CONTENT,
        hwPlaygroundConfigId: '4',
        content: {
            title: "Blink the Built-in LED",
            description: "Create a blinking light effect using the built-in LED and learn timing controls.",
            media: {
                image: {
                    url: "https://picsum.photos/500/400",
                }
            },
            articleSections: [
                {
                    title: "1. Progressive Web Apps (PWAs)",
                    content: "Progressive Web Apps are becoming increasingly popular due to their ability to provide app-like experiences directly through web browsers. They offer offline functionality, push notifications, and fast loading times, blurring the line between web and native applications.",
                    imageUrl: "https://picsum.photos/500/400",
                },],
        },

    },
    '6': {
        type: ProjectTypes.CONTENT,
        hwPlaygroundConfigId: '5',
        content: {
            title: "Making the Buzzer Beep",
            description: "Produce sound by controlling the buzzer and explore audio signals.",      media: {
                image: {
                    url: "https://picsum.photos/500/400",
                }
            },
            articleSections: [
                {
                    title: "1. Progressive Web Apps (PWAs)",
                    content: "Progressive Web Apps are becoming increasingly popular due to their ability to provide app-like experiences directly through web browsers. They offer offline functionality, push notifications, and fast loading times, blurring the line between web and native applications.",
                    imageUrl: "https://picsum.photos/500/400",
                },],
        },

    },

}


```

## playgroundadmin\AdminConfigComponents.ts

**Size:** 0 bytes  
**Language:** typescript

```typescript

```

## playgroundadmin\ConfigConstants.ts

**Size:** 720 bytes  
**Language:** typescript

```typescript
// Define types for our configuration
type MediaItem = {
    type: string;
    url: string;
    caption: string;
};

type PlaygroundConfig = {
    chapterId: number;
    type: string;
    content: {
        contentId: number;
        title: string;
        description: string;
        media: MediaItem[];
    };
    editorConfig: {
        toolboxType: string;
        toolboxContent: string[];
    };
    runnerConfig: {
        moduleName: string;
        moduleConfig: {
            matrixSize: number;
            matrixType: string;
            testCase: {
                initialState: number[][];
                expectedOutput: number[][];
            };
            controllerType: string;
        };
    };
};
```

## playgroundadmin\neopixelconfigadmin.tsx

**Size:** 23660 bytes  
**Language:** typescript

```typescript
// import { useState } from 'react';
//
// // Define types for our configuration
// type MediaItem = {
//     type: string;
//     url: string;
//     caption: string;
// };
//
// type PlaygroundConfig = {
//     chapterId: number;
//     type: string;
//     content: {
//         contentId: number;
//         title: string;
//         description: string;
//         media: MediaItem[];
//     };
//     editorConfig: {
//         toolboxType: string;
//         toolboxContent: string[];
//     };
//     runnerConfig: {
//         moduleName: string;
//         moduleConfig: {
//             matrixSize: number;
//             matrixType: string;
//             testCase: {
//                 initialState: number[][];
//                 expectedOutput: number[][];
//             };
//             controllerType: string;
//         };
//     };
// };
//
// // Enums for dropdown options
// const BlockKeys = {
//     turnOnLed: "turnOnLed",
//     controlsRepeat: "controlsRepeat",
//     delay: "delay",
//     turnOffLed: "turnOffLed",
//     moveForward: "moveForward",
//     moveBackward: "moveBackward",
//     turnLeft: "turnLeft",
//     turnRight: "turnRight"
// };
//
// const Modules = {
//     NeoPixelModule: "NeoPixelModule",
//     RobotModule: "RobotModule",
//     SensorModule: "SensorModule",
//     LCDModule: "LCDModule"
// };
//
// const MatrixType = {
//     UNI_DIRECTIONAL: "UNI_DIRECTIONAL",
//     BI_DIRECTIONAL: "BI_DIRECTIONAL",
//     SQUARE: "SQUARE"
// };
//
// const ControllerType = {
//     blocks: "blocks",
//     code: "code",
//     hybrid: "hybrid"
// };
//
// const MediaTypes = {
//     video: "video",
//     image: "image",
//     audio: "audio",
//     document: "document"
// };
//
// // Default config matches the sample JSON
// const defaultConfig: PlaygroundConfig = {
//     chapterId: 1,
//     type: 'content',
//     content: {
//         contentId: 0,
//         title: "Move pixel 1 step left",
//         description: "Move pixel 1 step left",
//         media: [
//             {
//                 type: "video",
//                 url: "",
//                 caption: ""
//             }
//         ]
//     },
//     editorConfig: {
//         toolboxType: 'flyoutToolbox',
//         toolboxContent: [BlockKeys.turnOnLed, BlockKeys.controlsRepeat, BlockKeys.delay, BlockKeys.turnOffLed],
//     },
//     runnerConfig: {
//         moduleName: Modules.NeoPixelModule,
//         moduleConfig: {
//             matrixSize: 11,
//             matrixType: MatrixType.UNI_DIRECTIONAL,
//             testCase: {
//                 initialState: [[5, 5]],
//                 expectedOutput: [[5, 4]],
//             },
//             controllerType: ControllerType.blocks
//         }
//     }
// };
// // @ts-ignore
// // Reusable Input Component
// const InputField = ({ label, value, onChange, type = "text", className = "" }) => {
//     return (
//         <div className={className}>
//             <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
//             <input
//                 type={type}
//                 value={value}
//                 onChange={(e) => onChange(type === "number" ? parseInt(e.target.value) : e.target.value)}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
//             />
//         </div>
//     );
// };
// // @ts-ignore
// // Reusable TextArea Component
// const TextAreaField = ({ label, value, onChange, rows = 2, className = "" }) => {
//     return (
//         <div className={className}>
//             <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
//             <textarea
//                 value={value}
//                 onChange={(e) => onChange(e.target.value)}
//                 rows={rows}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
//             />
//         </div>
//     );
// };
//
// // Reusable Dropdown Component
// const DropdownField = ({ label, value, onChange, options, className = "" }) => {
//     return (
//         <div className={className}>
//             <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
//             <select
//                 value={value}
//                 onChange={(e) => onChange(e.target.value)}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
//             >
//                 {Object.entries(options).map(([key, val]) => (
//                     <option key={key} value={val}>{key}</option>
//                 ))}
//             </select>
//         </div>
//     );
// };
//
// // Multi-select Dropdown Component
// const MultiSelectDropdown = ({ label, selectedValues, onChange, options, className = "" }) => {
//     const [showDropdown, setShowDropdown] = useState(false);
//     const [searchTerm, setSearchTerm] = useState("");
//
//     const toggleOption = (value) => {
//         if (selectedValues.includes(value)) {
//             onChange(selectedValues.filter(item => item !== value));
//         } else {
//             onChange([...selectedValues, value]);
//         }
//     };
//
//     const filteredOptions = Object.entries(options).filter(
//         ([key]) => key.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//
//     return (
//         <div className={`relative ${className}`}>
//             <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
//             <div
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white cursor-pointer flex justify-between items-center"
//                 onClick={() => setShowDropdown(!showDropdown)}
//             >
//                 <div className="truncate">
//                     {selectedValues.length > 0
//                         ? selectedValues.map(val =>
//                             Object.entries(options).find(([_, v]) => v === val)?.[0] || val
//                         ).join(', ')
//                         : 'Select options...'}
//                 </div>
//                 <div>▼</div>
//             </div>
//
//             {showDropdown && (
//                 <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
//                     <div className="p-2">
//                         <input
//                             type="text"
//                             placeholder="Search..."
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             onClick={(e) => e.stopPropagation()}
//                             className="w-full border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
//                         />
//                     </div>
//                     <div className="max-h-60 overflow-y-auto">
//                         {filteredOptions.map(([key, val]) => (
//                             <div
//                                 key={key}
//                                 className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${selectedValues.includes(val) ? 'bg-blue-50' : ''}`}
//                                 onClick={(e) => {
//                                     e.stopPropagation();
//                                     toggleOption(val);
//                                 }}
//                             >
//                                 <div className="flex items-center">
//                                     <input
//                                         type="checkbox"
//                                         checked={selectedValues.includes(val)}
//                                         onChange={() => {}}
//                                         className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                                     />
//                                     <span>{key}</span>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                     <div className="border-t p-2 flex justify-end">
//                         <button
//                             onClick={(e) => {
//                                 e.stopPropagation();
//                                 setShowDropdown(false);
//                             }}
//                             className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
//                         >
//                             Done
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };
//
// // Basic Configuration Component
// const BasicConfigComponent = ({ config, onChange }) => {
//     return (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <InputField
//                 label="Chapter ID"
//                 value={config.chapterId}
//                 onChange={(value) => onChange('chapterId', value)}
//                 type="number"
//             />
//
//             <DropdownField
//                 label="Type"
//                 value={config.type}
//                 onChange={(value) => onChange('type', value)}
//                 options={{
//                     content: "content",
//                     exercise: "exercise",
//                     challenge: "challenge"
//                 }}
//             />
//         </div>
//     );
// };
//
// // Media Item Component
// const MediaItemComponent = ({ mediaItem, index, onChange }) => {
//     return (
//         <div className="border p-3 rounded-md mb-3 bg-gray-50">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <DropdownField
//                     label="Media Type"
//                     value={mediaItem.type}
//                     onChange={(value) => onChange(`media[${index}].type`, value)}
//                     options={MediaTypes}
//                 />
//
//                 <InputField
//                     label="Media URL"
//                     value={mediaItem.url}
//                     onChange={(value) => onChange(`media[${index}].url`, value)}
//                 />
//
//                 <InputField
//                     label="Media Caption"
//                     value={mediaItem.caption}
//                     onChange={(value) => onChange(`media[${index}].caption`, value)}
//                     className="md:col-span-2"
//                 />
//             </div>
//         </div>
//     );
// };
//
// // Content Configuration Component
// const ContentComponent = ({ content, onContentChange }) => {
//     const handleChange = (path, value) => {
//         if (path.includes('media[')) {
//             const pathParts = path.split('.');
//             const mediaIndex = parseInt(pathParts[0].match(/\d+/)[0]);
//             const property = pathParts[1];
//
//             const updatedMedia = [...content.media];
//             updatedMedia[mediaIndex] = {
//                 ...updatedMedia[mediaIndex],
//                 [property]: value
//             };
//
//             onContentChange('content.media', updatedMedia);
//         } else {
//             onContentChange(`content.${path}`, value);
//         }
//     };
//
//     return (
//         <div>
//             <h3 className="font-medium mb-2">Content</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <InputField
//                     label="Content ID"
//                     value={content.contentId}
//                     onChange={(value) => onContentChange('content.contentId', value)}
//                     type="number"
//                 />
//
//                 <InputField
//                     label="Title"
//                     value={content.title}
//                     onChange={(value) => onContentChange('content.title', value)}
//                 />
//
//                 <TextAreaField
//                     label="Description"
//                     value={content.description}
//                     onChange={(value) => onContentChange('content.description', value)}
//                     className="md:col-span-2"
//                 />
//             </div>
//
//             <div className="mt-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Media</label>
//                 {content.media.map((item, index) => (
//                     <MediaItemComponent
//                         key={index}
//                         mediaItem={item}
//                         index={index}
//                         onChange={handleChange}
//                     />
//                 ))}
//
//                 <button
//                     onClick={() => {
//                         const newMedia = [...content.media, { type: "image", url: "", caption: "" }];
//                         onContentChange('content.media', newMedia);
//                     }}
//                     className="mt-2 bg-gray-200 text-gray-800 py-1 px-3 rounded text-sm hover:bg-gray-300 focus:outline-none"
//                 >
//                     Add Media Item
//                 </button>
//             </div>
//         </div>
//     );
// };
//
// // Editor Configuration Component
// const EditorConfigComponent = ({ editorConfig, onEditorConfigChange }) => {
//     return (
//         <div>
//             <h3 className="font-medium mb-2">Editor Configuration</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <DropdownField
//                     label="Toolbox Type"
//                     value={editorConfig.toolboxType}
//                     onChange={(value) => onEditorConfigChange('editorConfig.toolboxType', value)}
//                     options={{
//                         flyoutToolbox: "flyoutToolbox",
//                         categoryToolbox: "categoryToolbox",
//                         simpleToolbox: "simpleToolbox"
//                     }}
//                 />
//
//                 <MultiSelectDropdown
//                     label="Toolbox Content"
//                     selectedValues={editorConfig.toolboxContent}
//                     onChange={(values) => onEditorConfigChange('editorConfig.toolboxContent', values)}
//                     options={BlockKeys}
//                     className="md:col-span-2"
//                 />
//             </div>
//         </div>
//     );
// };
//
// // Test Case Component
// const TestCaseComponent = ({ testCase, onChange }) => {
//     return (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <InputField
//                 label="Initial State (format: x,y;x,y)"
//                 value={testCase.initialState.map(coord => coord.join(',')).join(';')}
//                 onChange={(value) => {
//                     try {
//                         // Parse string like "5,5;6,6" to [[5,5],[6,6]]
//                         const coordSets = value.split(';');
//                         const coordArrays = coordSets.map(set =>
//                             set.split(',').map(coord => parseInt(coord.trim()))
//                         );
//                         onChange('runnerConfig.moduleConfig.testCase.initialState', coordArrays);
//                     } catch (e) {
//                         console.error("Invalid matrix state format", e);
//                     }
//                 }}
//             />
//
//             <InputField
//                 label="Expected Output (format: x,y;x,y)"
//                 value={testCase.expectedOutput.map(coord => coord.join(',')).join(';')}
//                 onChange={(value) => {
//                     try {
//                         // Parse string like "5,4;6,5" to [[5,4],[6,5]]
//                         const coordSets = value.split(';');
//                         const coordArrays = coordSets.map(set =>
//                             set.split(',').map(coord => parseInt(coord.trim()))
//                         );
//                         onChange('runnerConfig.moduleConfig.testCase.expectedOutput', coordArrays);
//                     } catch (e) {
//                         console.error("Invalid matrix state format", e);
//                     }
//                 }}
//             />
//         </div>
//     );
// };
//
// // Runner Configuration Component
// const RunnerConfigComponent = ({ runnerConfig, onRunnerConfigChange }) => {
//     return (
//         <div>
//             <h3 className="font-medium mb-2">Runner Configuration</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <DropdownField
//                     label="Module Name"
//                     value={runnerConfig.moduleName}
//                     onChange={(value) => onRunnerConfigChange('runnerConfig.moduleName', value)}
//                     options={Modules}
//                 />
//
//                 <InputField
//                     label="Matrix Size"
//                     value={runnerConfig.moduleConfig.matrixSize}
//                     onChange={(value) => onRunnerConfigChange('runnerConfig.moduleConfig.matrixSize', value)}
//                     type="number"
//                 />
//
//                 <DropdownField
//                     label="Matrix Type"
//                     value={runnerConfig.moduleConfig.matrixType}
//                     onChange={(value) => onRunnerConfigChange('runnerConfig.moduleConfig.matrixType', value)}
//                     options={MatrixType}
//                 />
//
//                 <DropdownField
//                     label="Controller Type"
//                     value={runnerConfig.moduleConfig.controllerType}
//                     onChange={(value) => onRunnerConfigChange('runnerConfig.moduleConfig.controllerType', value)}
//                     options={ControllerType}
//                 />
//
//                 <div className="md:col-span-2 border-t pt-3 mt-2">
//                     <h4 className="text-sm font-medium mb-2">Test Case</h4>
//                     <TestCaseComponent
//                         testCase={runnerConfig.moduleConfig.testCase}
//                         onChange={onRunnerConfigChange}
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// // Main Component
// export default function PlaygroundConfigAdmin() {
//     const [showForm, setShowForm] = useState(false);
//     const [config, setConfig] = useState<PlaygroundConfig>(defaultConfig);
//     const [jsonOutput, setJsonOutput] = useState("");
//
//     // Handle nested property changes
//     const handleChange = (path: string, value: any) => {
//         const newConfig = {...config};
//         const parts = path.split('.');
//         let current: any = newConfig;
//
//         for (let i = 0; i < parts.length - 1; i++) {
//             current = current[parts[i]];
//         }
//
//         current[parts[parts.length - 1]] = value;
//         setConfig(newConfig);
//     };
//
//     // Generate JSON output
//     const handleCreateConfig = () => {
//         setJsonOutput(JSON.stringify(config, null, 2));
//     };
//
//     return (
//         <div className="min-h-screen bg-gray-50 py-8 px-4">
//             <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6">
//                 <h1 className="text-2xl font-bold mb-6 text-gray-800">Playground Configuration Admin</h1>
//
//                 {!showForm ? (
//                     <button
//                         onClick={() => setShowForm(true)}
//                         className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     >
//                         Create Playground Config
//                     </button>
//                 ) : (
//                     <div className="space-y-6">
//                         <h2 className="text-xl font-semibold border-b pb-2">Configure Playground</h2>
//
//                         {/* Basic Configuration */}
//                         <div className="border-t pt-4">
//                             <BasicConfigComponent
//                                 config={config}
//                                 onChange={handleChange}
//                             />
//                         </div>
//
//                         {/* Content Configuration */}
//                         <div className="border-t pt-4">
//                             <ContentComponent
//                                 content={config.content}
//                                 onContentChange={handleChange}
//                             />
//                         </div>
//
//                         {/* Editor Configuration */}
//                         <div className="border-t pt-4">
//                             <EditorConfigComponent
//                                 editorConfig={config.editorConfig}
//                                 onEditorConfigChange={handleChange}
//                             />
//                         </div>
//
//                         {/* Runner Configuration */}
//                         <div className="border-t pt-4">
//                             <RunnerConfigComponent
//                                 runnerConfig={config.runnerConfig}
//                                 onRunnerConfigChange={handleChange}
//                             />
//                         </div>
//
//                         {/* Action Buttons */}
//                         <div className="flex justify-end space-x-3 pt-4 border-t">
//                             <button
//                                 onClick={() => {
//                                     setShowForm(false);
//                                     setJsonOutput("");
//                                 }}
//                                 className="border border-gray-300 bg-white text-gray-700 py-2 px-4 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={handleCreateConfig}
//                                 className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
//                             >
//                                 Create Configuration
//                             </button>
//                         </div>
//
//                         {/* JSON Output */}
//                         {jsonOutput && (
//                             <div className="mt-6">
//                                 <h3 className="text-lg font-medium mb-2">Generated Configuration:</h3>
//                                 <div className="bg-gray-800 text-white p-4 rounded-md overflow-auto max-h-96">
//                                     <pre>{jsonOutput}</pre>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }
```

## projects-conrent.ts

**Size:** 2817 bytes  
**Language:** typescript

```typescript
import { Project } from "@/components/component/project-page";

export const projectList: Project[] = [
    {
        image: "https://cdn.dribbble.com/users/1161944/screenshots/11405399/media/c184714ddf9ac81cd470a616fe2d2cf1.png?resize=1600x1200&vertical=center",
        name: "Getting Started with the Kit",
        description: "A beginner-friendly guide to unpacking and using your electronics kit effectively.",
        contentId: '1',
    },
    {
        image: "https://cdn.dribbble.com/users/1161944/screenshots/11405399/media/c184714ddf9ac81cd470a616fe2d2cf1.png?resize=1600x1200&vertical=center",
        name: "Connecting and Running the Setup",
        description: "Learn how to connect the kit components and run your first program.",
        contentId: '2',
    },
    {
        image: "https://cdn.dribbble.com/users/1161944/screenshots/11405399/media/c184714ddf9ac81cd470a616fe2d2cf1.png?resize=1600x1200&vertical=center",
        name: "Light Up the Built-in LED",
        description: "Discover how to control the default LED and make it shine with your first command.",
        contentId: '3',
    },
    {
        image: "https://cdn.dribbble.com/users/1161944/screenshots/11405399/media/c184714ddf9ac81cd470a616fe2d2cf1.png?resize=1600x1200&vertical=center",
        name: "Turning Off the LED",
        description: "Master the basics of turning off the built-in LED with simple commands.",
        contentId: '4',
    },
    {
        image: "https://cdn.dribbble.com/users/1161944/screenshots/11405399/media/c184714ddf9ac81cd470a616fe2d2cf1.png?resize=1600x1200&vertical=center",
        name: "Blink the Built-in LED",
        description: "Create a blinking light effect using the built-in LED and learn timing controls.",
        contentId: '5',
    },
    {
        image: "https://cdn.dribbble.com/users/1161944/screenshots/11405399/media/c184714ddf9ac81cd470a616fe2d2cf1.png?resize=1600x1200&vertical=center",
        name: "Making the Buzzer Beep",
        description: "Produce sound by controlling the buzzer and explore audio signals.",
        contentId: '6',
    },
    {
        image: "https://cdn.dribbble.com/users/1161944/screenshots/11405399/media/c184714ddf9ac81cd470a616fe2d2cf1.png?resize=1600x1200&vertical=center",
        name: "Buzzer Beep Challenge: 10 Times",
        description: "Take on the challenge of making the buzzer beep 10 times in a row with precise control.",
        contentId: '7',
    },
    {
        image: "https://cdn.dribbble.com/users/1161944/screenshots/11405399/media/c184714ddf9ac81cd470a616fe2d2cf1.png?resize=1600x1200&vertical=center",
        name: "Syncing LED Blinks with Buzzer Beeps",
        description: "Combine visuals and sound by synchronizing LED blinks and buzzer beeps for a fun effect.",
        contentId: '8',
    },
];

```

