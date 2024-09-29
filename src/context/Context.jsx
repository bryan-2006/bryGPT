import { createContext, useState } from "react";
import runChat from "../config/brygpt";

export const Context = createContext();

const ContextProvider = (props) => {
    
    const [input, setInput] = useState(""); //To save input data
    const [recentPrompt, setRecentPrompt] = useState(""); //Input saved to main comp
    const [prevPrompts, setPrevPrompts] = useState([]); //To show previous inputs
    const [showResult, setShowResult] = useState(false); //To hide the greeting text and cards
    const [loading, setLoading] = useState(false); //For loading animation
    const [resultData, setResultData] = useState(""); //To display data from Gemini
    
    const delayPara = (index, nextWord) => {
        setTimeout(function () {
            setResultData(prev => prev + nextWord);
        }, 75*index)
    }

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
    }

    const onSent = async(prompt) => {

        setResultData("");
        setLoading(true);
        setShowResult(true);
        let response;

        if(prompt !== undefined){
            response = await runChat(input);
            setRecentPrompt(prompt);
        }else{
            setPrevPrompts(prev => [...prev, input])
            setRecentPrompt(input);
            response = await runChat(input);
        }

        let responseArray = response.split("**");
        let newResponseWithBold = ""; 
        for(let i=0; i < responseArray.length; i++){
            if(i === 0 || i%2 == 0){
                newResponseWithBold += responseArray[i];
            }
            else{
                newResponseWithBold += "<b>" + responseArray[i] + "</b>";
            }
        }

        let newResponseWithNewLine = newResponseWithBold.split("*").join("<br/>");

        let newResponseArray = newResponseWithNewLine.split(" ");
        for(let i=0; i < newResponseArray.length; i++){
            const nextWord = newResponseArray[i];
            delayPara(i, nextWord + " ");
        }
        setLoading(false);
        setInput("")
    }

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;