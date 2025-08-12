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