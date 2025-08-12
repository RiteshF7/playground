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