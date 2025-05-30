//app/components/PromptSuggestionButton.tsx
const PromptSuggestionsButton = ({ text, onClick }: { text: string; onClick: () => void }) => {
    return (
        <button className="prompt-suggestion-button" onClick={onClick}>
            {text}
        </button>
    );
};

export default PromptSuggestionsButton;
