import React, { useState, useEffect, useRef } from 'react'
import { Card } from 'react-bootstrap'
import { GoDotFill, GoDot } from "react-icons/go";
import './About.css'

const Thought = () => {
  const [step, setStep] = useState(1);

  const totalSteps = 2; // Set this to however many steps you have
  const intervalRef = useRef(null);

  const startInterval = () => {
    intervalRef.current = setInterval(() => {
      setStep(prev => (prev === totalSteps ? 1 : prev + 1));
    }, 3000);
  };

  const stopInterval = () => {
    clearInterval(intervalRef.current);
  };

  useEffect(() => {
    startInterval(); // start on mount

    return () => stopInterval(); // cleanup on unmount
  }, []);

  // step change
  const handleSettingStep1 = () => {
    setStep(1); // Proceed to the next step
  };

  const handleSettingStep2 = () => {
    setStep(2); // Proceed to the next step
  };

  const handleSettingStep3 = () => {
    setStep(3); // Proceed to the next step
  };


  return (
    <div>
    <div onMouseEnter={stopInterval}
      onMouseLeave={startInterval}>
      <Card className='mx-4 p-3 border rounded shadow '>

        <Card.Title className='fs-3 bg-primary rounded p-2 text-light'>What do we think?</Card.Title>
        <Card.Body className=''>

          {step === 1 && (


            <div className='mb-2 about_text_a' >
              <div className='mb-1'>
              <em className='fw-bold'>The</em> tradition that existed among our Sanatan Dharma followers was the Gurukul Tradition, where those interested in studying were Taught from the Temple. And the one who was one of the Medical experts looked after the Health system of the Society.</div>
              <div className='mb-1'>
               <em className='fw-bold'>Although</em> over time we have forgotten that tradition, Christian missionaries have adopted that tradition partially in the Modern Education System and have been able to take control of the Education and Health system of India and the world.
               </div>
               <div className='mb-1'>
               <em className='fw-bold'>A report</em> has shown that Christian Missionaries have taken the responsibility of educating most of the Christians. Along with this, they organize various scholarships in different colleges to utilize the Knowledge and Intellect of the Sanatan Dharma followers. And after getting that scholarship, <em> our Brothers and Sisters </em> remain grateful to those Missionaries.</div>
               <div className='mb-1'>
                <em className='fw-bold'>And</em> for all the work of the Missionaries, every person in the Christian community who is able to provide money. They donate at least 10 percent of their Income to the Missionaries.
                </div>
            </div>
          )}


          {step === 2 && (


            <div className='mb-2 about_text_b' >
              <div className='mb-1'>
              <em className='fw-bold'> Although</em> there is a special importance of donation in Sanatan Dharma, there is no rule of compulsory donation among us. 
              <em className=''>By</em> donating, we want to earn Virtue or attain salvation. More or less, many of us donate in temples, in the donation box in front of God, or through some NGO.
             
              </div>
              
              <div className='mb-1'>
              <em className='fw-bold'>Do</em> we do any kind of inquiry after donating? What has been done for our community with our donation money? We think none of us do that.
               
               <em > We,</em> the followers of Sanatan Dharma, donate crores of amounts to big temples. But we do not get any facilities for the backward followers of Sanatan Dharma or any quality education or free advanced health services for the entire community.
               </div>
               
               <div className='mb-1'>
                
              
               <em className='fw-bold'>In India,</em> there is no dearth of well-established NGOs, nor is there any dearth of kind-hearted donors. But despite this, there are still a large number of people below the poverty line, who are deprived of better education and health care due to lack of money. It is acceptable that better education and health care are beyond the reach of many. But the lack of basic amenities and nutritious food affects everyone from children to the elderly, and this is undesirable.
               </div>
            </div>
          )}

          <div className='d-flex justify-content-center' style={{ fontSize: "30px" }}>
            <div onClick={handleSettingStep1} style={{ cursor: "pointer" }}> {step === 1 ? (<GoDotFill />) : (<GoDot />)} </div>
            <div onClick={handleSettingStep2} style={{ cursor: "pointer" }}> {step === 2 ? (<GoDotFill />) : (<GoDot />)} </div>
            {/* <div onClick={handleSettingStep3} style={{ cursor: "pointer" }}> {step === 3 ? (<GoDotFill />) : (<GoDot />)} </div> */}


          </div>
        </Card.Body>
      </Card>
    </div>
    
    </div>
  )
}

export default Thought