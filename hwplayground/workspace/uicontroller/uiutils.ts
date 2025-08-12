export function delay(seconds: number): void {
    (window as any)._elg_pg_comm_channel.sendMessage('delay', {
        time: seconds * 1000
    });
}