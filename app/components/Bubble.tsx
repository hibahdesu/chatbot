//app/components/Bubble.tsx
interface Message {
    content: string;
    role: string;
}

const Bubble = ({ message }: { message: Message }) => {
    const { content, role } = message;
    return (
        <div className={`${role} bubble`}>
            { content }
        </div>
    );
};

export default Bubble;
