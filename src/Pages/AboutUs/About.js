import React, {useState, useEffect, useRef} from 'react'
import Thought from './Thought'
import { Card } from 'react-bootstrap'
import './About.css'
import { IoArrowRedo } from "react-icons/io5";
import DonateTemplate from '../../Components/Common/DonateTemplate';

const About = () => {
  const [step, setStep] = useState(1);

  const totalSteps = 3; // Set this to however many steps you have
    const intervalRef = useRef(null);
  
    const startInterval = () => {
      intervalRef.current = setInterval(() => {
        setStep(prev => (prev === totalSteps ? 1 : prev + 1));
      }, 6000);
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
    <div > 
      <h2 className="text-center pt-2 herO">About Us</h2>
      <div className='d-flex justify-content-center pb-2'>
        <div onClick={handleSettingStep1} style={{ cursor: "pointer", marginRight:"5px" }}> 
          {step === 1 ? (<svg width="85" height="35" xmlns="http://www.w3.org/2000/svg">
            <rect width="70" height="20" x="10" y="10" rx="10" ry="10" style={{fill:"rgba(65, 65, 211, 0.16)", strokeWidth:"1", stroke:"blue"}} />
          </svg>
          ) : (
            <svg width="85" height="35" xmlns="http://www.w3.org/2000/svg">
              <rect width="70" height="20" x="10" y="10" rx="10" ry="10" style={{fill:"rgb(8, 8, 231)",  fillOpacity:"0.2"}} />
            </svg>)} 
            </div>
        <div onClick={handleSettingStep2} style={{ cursor: "pointer", marginRight:"5px" }}> 
          {step === 2 ? (<svg width="85" height="35" xmlns="http://www.w3.org/2000/svg">
            <rect width="70" height="20" x="10" y="10" rx="10" ry="10" style={{fill:"rgba(209, 126, 17, 0.39)", strokeWidth:"1", stroke:"blue"}} />
          </svg>
          ) : (
            <svg width="85" height="35" xmlns="http://www.w3.org/2000/svg">
              <rect width="70" height="20" x="10" y="10" rx="10" ry="10" style={{fill:"rgb(209, 126, 17)",  fillOpacity:"0.2"}} />
            </svg>)} 
            </div>
        <div onClick={handleSettingStep3} style={{ cursor: "pointer", marginRight:"5px" }}> 
          {step === 3 ? (<svg width="85" height="35" xmlns="http://www.w3.org/2000/svg">
            <rect width="70" height="20" x="10" y="10" rx="10" ry="10" style={{fill:"rgba(209, 17, 145, 0.23)", strokeWidth:"1", stroke:"blue"}} />
          </svg>
          ) : (
            <svg width="85" height="35" xmlns="http://www.w3.org/2000/svg">
              <rect width="70" height="20" x="10" y="10" rx="10" ry="10" style={{fill:"rgba(193, 17, 209, 0.62)",  fillOpacity:"0.2"}} />
            </svg>)} 
            </div>
        


      </div>
      {step === 1 &&(
        <Thought/>
      )}
      {step === 2 && (
        <div>
          <div>
            <Card className='mx-4 p-3 border rounded shadow '>

              <Card.Title className='fs-3 bg-secondary rounded p-2 text-light'>Our Vision</Card.Title>
              <Card.Body className=''>
                <div className='p-3 about_text_c'>
                  <div className='mb-2'>
                  <IoArrowRedo /> <em className='fw-bold'> To</em> build a strong society by providing better education and healthcare to all followers of Sanatan Dharma.

                  </div>
                  <div className='mb-2'>
                  <IoArrowRedo /> <em className='fw-bold'>And </em> to unite and organize by fulfilling the minimum needs of each and every Sanatani.
                  </div>

                  <div className='mb-2'>
                  <IoArrowRedo /> <em className='fw-bold'>Increase </em> the fertility rate among the followers of Sanatan Dharma by providing all kinds of support.
                  </div>

                  <div className='mb-2'>
                  <IoArrowRedo /> <em className='fw-bold'>Bringing </em>  together all the organizations that identify themselves as Sanatan philanthropists or work for the followers of Sanatan Dharma. It could be temple committees or associations of saints, such as Anukul Thakur's Satsangh and Bharat Sevashram.
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      )}
      {step === 3 && (
        <div>
          <div>
            <Card className='mx-4 p-3 border rounded shadow '>

              <Card.Title className='fs-3 bg-warning rounded p-2 '>Our Objective</Card.Title>
              <Card.Body className=''>
                <div className='p-3 about_text_c'>
                  

                  <div className='mb-2'>
                  <em className='fw-bold'>According </em> to Chanakya Niti, giving (Dana) to the poor and needy can reduce poverty. But donations should go to those who truly need help, not to the rich.
                  </div>
                  <div className='mb-2'>
                  <IoArrowRedo /> <em className='fw-bold'>If </em>  you donate through us, we will make sure that your donation reaches the right person.
                  </div>
                  <div className='mb-2'>
                  <IoArrowRedo /> <em className='fw-bold'> We</em>  will not allow any child in our community to be deprived of quality education and health services due to lack of money.
                  </div>
                  <div className='mb-2'>
                  <IoArrowRedo /> <em className='fw-bold'>We </em> will never let any elderly parent feel lonely.
                  </div>
                  <div className='mb-2'>
                  <IoArrowRedo /> <em className='fw-bold'> Trying</em>  to unite all the followers of Sanatan Dharma. This is a huge challenge, and we will try to complete that challenge.
                  </div>
                  <div className='mb-2'>
                  <IoArrowRedo /> <em className='fw-bold'> In</em>  a word, bringing all followers of Sanatan Dharma under one umbrella.
                  </div>


                </div>


              </Card.Body>
            </Card>


          </div>
        </div>
      )}

      <div className='p-5'>
        <DonateTemplate/>
      </div>
      



      
      
    
    
    </div>
  )
}

export default About