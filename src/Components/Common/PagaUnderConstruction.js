import React from 'react';
import { Button, Card } from 'react-bootstrap';

const PageUnderConstruction = () => {
  return (
    

       <div 
      className='d-flex justify-content-center flex-column align-items-center p-3' 
      style={{ minHeight:'calc(100vh - 115px)' }}
    >
      <Card className='text-center shadow-sm' style={{ maxWidth: "500px", width: "100%", height: "300px" }}>
        <img 
          src="/uc.webp" 
          alt="Page Under Construction" 
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </Card>
       <h4 className='text-center mt-5'>Only our Campaign service available at this time, Where you can create Campaign Survey and Analysis.</h4>
      <Button href='/campaigner-dashboard'>
        Campaigner Dashboard
      </Button>
      
    </div>

   
    
   
  );
};

export default PageUnderConstruction;
