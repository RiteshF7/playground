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
