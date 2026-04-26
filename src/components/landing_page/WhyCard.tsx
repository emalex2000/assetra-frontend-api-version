type WhyCardVariant = "white" | "black";

interface WhyProps{
    headerText: string;
    text: string;
    variant: WhyCardVariant;
    className?: string; 
}
const WhyCard: React.FC<WhyProps> = ({
    headerText,
    text,
    variant,
    className,
}) => {
    const baseStyles = "rounded-lg flex flex-col gap-3 min-w-45.25 px-2 py-1 shadow-lg"
    const variants: Record<WhyCardVariant, string> = {
        white: "bg-white",
        black: "bg-black text-white"
    };
    return(
        <>
            <div className={`${baseStyles} ${variants[variant]} ${className}`}>
                <h1 className="text-[20px] max-w-51.25">{headerText}</h1>
                <p>{text}</p>
            </div>
        </>
    )
}

export default WhyCard;