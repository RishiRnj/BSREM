// import React from 'react'
// import "./FAQ.css";

// const FAQ = () => {
//   return (
//     <div>



// <section id="faq" class="faq">
//   <h1 class="heading">FAQ</h1>
//   <div class="row">
//     <div class="image">
//       <img src="/faq.webp" alt=""/>
//     </div>
//     <div class="accordion-container">
//       <div class="accordion">
//         <div class="accordion-header">
//           <span>+</span>
//           <h3>What are the main problems of Hindus around the world?</h3>
//         </div>
//         <div class="accordion-body">
//           <p>Basically, there is a lack of unity, due to lack of unity, there is no interaction with people from lower
//             economic classes. This is also seen when a financially backward person becomes prosperous. Then he forgets
//             about the financially backward people. He thinks, now is the opportunity, let's save as much as possible.
//             This is just an example to explain. Think about it and you will see that if there is no greed or desire,
//             then no one will have any problem.</p>
//         </div>
//       </div>

//       <div class="accordion">
//         <div class="accordion-header">
//           <span>+</span>
//           <h3>Why this website and the surveys conducted on this website?</h3>
//         </div>
//         <div class="accordion-body">
//           <p>The purpose of the website is to connect with Hindus from different parts of the world, and in the age of
//             the internet, this is possible if everyone makes an effort, and the survey that has been conducted on this
//             website has three aspects. First, to unite Hindus. Second, to observe what kind of problems Hindus are
//             facing. Third, there are many cultural and historical facts that we have all almost forgotten. but how many
//             people know that. There are also different types of questions from which we can conclude in one word what
//             Hindus are thinking today.</p>
//         </div>
//       </div>

//       <div class="accordion">
//         <div class="accordion-header">
//           <span>+</span>
//           <h3>As a Hindu, what is your role on this website?</h3>
//         </div>
//         <div class="accordion-body">
//           <p>As a Hindu, the first role on this website is to participate in the survey. Second, you express your views
//             on the forum page and ypu listen to the views of other Hindu brothers and sisters.JoinUs is a page dedicated
//             to you if you like our work and want to join us. You can visit that too. If you want to support us
//             financially or in any other way, you can do that by clicking on the Donation link.</p>
//         </div>
//       </div>

//       <div class="accordion">
//         <div class="accordion-header">
//           <span>+</span>
//           <h3>Is it really possible to unite Hindus through this website?</h3>
//         </div>
//         <div class="accordion-body">
//           <p>We are not claiming that this is the only way. There are many Hindu organizations working to unite Hindus.
//             We may not be able to do what they are doing. And it is also a fact that they will never be able to do what
//             we want to do. And like everyone else, this is also an attempt to unite Hindus, but in a different way. If
//             our work contributes to the progress of the work of uniting Hindus, we may feel proud.</p>
//         </div>
//       </div>

//       <div class="accordion">
//         <div class="accordion-header">
//           <span>+</span>
//           <h3>How transparent is this website or the people behind it?</h3>
//         </div>
//         <div class="accordion-body">
//           <p>If any Hindu brother or sister has any questions about this website and our transparency, we will be
//             transparent like glass in all public but still, I will say that there is no need for any financial
//             transaction. You participate in the survey and give your opinion in the forum and comment on the opinions of
//             different people. And send it to your acquaintances then there is no need for money.</p>
//         </div>
//       </div>
//     </div>
//   </div>
// </section>
      

//   </div>
//   )
// }

// export default FAQ



import React, {useState} from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Stack,
  Box,
  Container
} from '@mui/material';
import { IoIosArrowDown } from "react-icons/io";
import { deepPurple,  } from '@mui/material/colors';
import DonateTemplate from '../../Components/Common/DonateTemplate';
import { Badge } from 'react-bootstrap';



const faqs = [
  {
    question: "What are the main problems of Hindus around the world?",
    answer: `Basically, there is a lack of unity, due to lack of unity, there is no interaction with people from lower
            economic classes. This is also seen when a financially backward person becomes prosperous. Then he forgets
            about the financially backward people. He thinks, now is the opportunity, let's save as much as possible.
            This is just an example to explain. Think about it and you will see that if there is no greed or desire,
            then no one will have any problem.`,
  },
  {
    question: "Why this website and the surveys conducted on this website?",
    answer: `The purpose of the website is to connect with Hindus from different parts of the world, and in the age of
            the internet, this is possible if everyone makes an effort, and the survey that has been conducted on this
            website has three aspects. First, to unite Hindus. Second, to observe what kind of problems Hindus are
            facing. Third, there are many cultural and historical facts that we have all almost forgotten. but how many
            people know that. There are also different types of questions from which we can conclude in one word what
            Hindus are thinking today.`,
  },
];

const FAQ = () => {

  const quesB = deepPurple[500];
  const quesT = "#F5EBFF";

  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleAccordionChange = (index) => (event, isExpanded) => {
    setExpandedIndex(isExpanded ? index : null);
  };


  return (
    <>
    <div className="heroF">
      {/* <h5 className="hero__title text-center ">Bishwa Sanatan Raksha evam Ekta Manch</h5> */}
      <div className=''>
      <span className="cube ">  </span>
      <span className="cube "></span>
      <span className="cube "></span>
      <span className="cube "></span>
      <span className="cube "></span>
      <span className="cube "></span>
      </div>
    </div>
    <div className='d-flex justify-content-center faq ' //style={{ minHeight: `calc(100vh - 175px)`, }} 
     >
    <Box id="" sx={{py:2 , backgroundColor: '', minHeight: `calc(100vh - 115px)` }}>
      <Container>
      <h5 className="herO text-center text-muted fw-bold fs-1">Bishwa Sanatan Raksha evam Ekta Manch</h5>
        <h2  className='herO text-center fw-bold fs-1'><Badge>FAQ</Badge></h2>

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={4}
          alignItems="center"
        >
          {/* Image */}
          <Box
            component="img"
            className='faqB'
            src="/faq.webp"
            alt="FAQ Visual"
            sx={{
              width: { xs: '70%', md: '50%' },
              borderRadius: 2,
            }}
          />

          {/* Accordions */}
          <Box sx={{ width: { xs: '100%', md: '50%' } }}>
            {faqs.map((faq, index) => (

              <Accordion key={index} expanded={expandedIndex === index}
              onChange={handleAccordionChange(index)} sx={{my:2}}>
                <AccordionSummary expandIcon={<IoIosArrowDown size={25} color={quesT}/>} sx={{backgroundColor: quesB,}}>
                  <Typography variant="h6" sx={{color:quesT}} >{faq.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="subtitle2">{faq.answer}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Stack>
      </Container>
    </Box>
    </div>
    <div className='p-5'>
        <DonateTemplate/>
      </div>
    </>
  );
};

export default FAQ;

