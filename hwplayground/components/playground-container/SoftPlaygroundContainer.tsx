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