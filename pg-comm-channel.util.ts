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







