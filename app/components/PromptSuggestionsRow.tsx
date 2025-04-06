//app/components/PromptSuggestionsRow.tsx
import PromptSuggestionsButton from "./PromptSuggestionButton";

interface PromptSuggestionsRowProps {
    onPromptClick: (prompt: string) => void;
}

const PromptSuggestionsRow = ({ onPromptClick }: PromptSuggestionsRowProps) => {
    const prompts = [
        "Where can I find a restaurant serving Najdi food?",
        "Are there any halal restaurants here?",
        "What are the best restaurants for seafood?",
        "Are there any festivals in Al-Ula this month?",
        "¿Puedo usar ropa no tradicional en lugares públicos?"
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
