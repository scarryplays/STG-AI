import { useEffect,useState } from "react"


 
 
 function Popup () {

  const{domain , setDomain } = useState("")

  useEffect(()=>{
    chrome.tabs.query({active:true,currentWindow:true},(tabs)=>{
        const url = new URL(tabs[0].url)
      setDomain(url.hostname)           
    })
  },[])



 
    return (
        <>
        <div>
            <h1> hello okay STG AI</h1>
            <p>Analyzing trust</p>
            <strong>{domain}</strong>
        </div>
        </>
    )
}
export default Popup