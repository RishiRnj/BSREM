import React from "react";
import { Page, Text, View, Font, Document, Image, StyleSheet } from "@react-pdf/renderer";




// Styles for the PDF document
const styles = StyleSheet.create({
    page: {
      position: "relative",
      flexDirection: "column",
      backgroundColor: "#f9f9f9",
      padding: 20,
    },
  
    backgroundContainer: {
      position: "absolute", // Ensures it is placed behind content
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
    },
  
    background: {
      width: "100%",
      height: "100%",
    },
  
    content: {
      position: "relative", // Ensures text is above background
      zIndex: 1, // Keeps text above the background
    },
  
    header: {
      marginTop: 60,
      fontSize: 30,
      textAlign: "center",
      marginBottom: 5,      
      fontFamily: "Helvetica-Bold"      
    },
    motto:{
      textAlign: "center",
      fontSize: 20,
      
      marginBottom: 5,
      paddingLeft: 35,
      paddingRight: 35,      
      fontFamily: "Times-Bold",
      color: "#8c1aff" 
    },
    textTop:{
      textAlign: "center",
      fontSize: 20,  
      paddingRight: 35,    
      marginBottom: 5,
      paddingLeft: 35,
      marginTop: 10,

    },
  
    section: {
      marginBottom: 10,
      padding: 10,
      borderBottom: "1px solid #ddd",
    },
    sectionTop: {
      display: "flex",
      flexDirection: "row",
      marginBottom: 10,

      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 5,
      marginRight: 30,
      padding: 10,
      
    },
  
    text: {
      fontSize: 16,
      marginBottom: 5,
      marginLeft: 35,
      fontFamily: "Times-Roman",
    },
  
    profileImage: {
      width: 150,
      height: 150,
      borderRadius: 50,
      objectFit: "cover",
      marginVertical: 10,
    },
  });
  

const VolunteerPDF = ({ formData, imagePreviewA4 }) => (
  <Document>
    <Page size="A4" style={styles.page}>
  {/* Background Image (Correctly Layered) */}
  <View style={styles.backgroundContainer}>
    <Image src={imagePreviewA4} style={styles.background} />
  </View>

  {/* Content on Top of Background */}
      <View style={styles.content}>
        <Text style={styles.header}>{formData.organizationName}</Text>
        <Text style={styles.motto}>{formData.motto}</Text>
        <Text style={styles.textTop}>-: Details of the Volunteer :-   </Text>

        <view style={styles.sectionTop}>
          
          <Text style={styles.text}>Name: {formData.username}</Text>
          <view>

            {formData.userImage ? (
              <Image src={formData.userImage} style={styles.profileImage} />
            ) : (
              <Text>No Image</Text>
            )}

          </view>
    
    

    </view>

    <View style={styles.section}>
      <Text style={styles.text}>Name: {formData.username}</Text>
      <Text style={styles.text}>Mobile: {formData.mobile}</Text>
      <Text style={styles.text}>Blood Group: {formData.bloodGroup}</Text>
      <Text style={styles.text}>City: {formData.city}</Text>
    </View>

    <View style={styles.section}>
      
    </View>
  </View>
</Page>

  </Document>
);

export default VolunteerPDF;
