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
