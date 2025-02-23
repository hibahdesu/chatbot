import PromptSuggestionsButton from "./PromptSuggestionButton";

interface PromptSuggestionsRowProps {
    onPromptClick: (prompt: string) => void;
}

const PromptSuggestionsRow = ({ onPromptClick }: PromptSuggestionsRowProps) => {
    const prompts = [
        "What is Kaleem?",
        "Who can use Kaleem?",
        "How does Kaleem work?"
    ];

    return (
        <div className="prompt-suggestion-row">
            {prompts.map((prompt, index) => (
                <PromptSuggestionsButton
                    key={`suggestion-${index}`}
                    text={prompt}
                    onClick={() => onPromptClick(prompt)}
                />
            ))}
        </div>
    );
};

export default PromptSuggestionsRow;
