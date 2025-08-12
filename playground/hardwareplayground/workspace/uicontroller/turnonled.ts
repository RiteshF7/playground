export default function turnLed(state: boolean): void {
    (window as any)._elg_pg_comm_channel.sendMessage('LED', {
        active: !!state,
        color: 'red'
    });
}
