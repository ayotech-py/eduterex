import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: "Helvetica",
  },
  header: {
    fontSize: 24,
    color: "blue",
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 12,
    marginBottom: 10,
  },
  list: {
    marginTop: 10,
    marginLeft: 20,
  },
  listItem: {
    fontSize: 12,
    marginBottom: 5,
  },
});

// React PDF Component
const ResultPDF = () => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.header}>Hello, PDF!</Text>
      <Text style={styles.paragraph}>
        This is a sample text to showcase React PDF generation.
      </Text>
      <View style={styles.list}>
        <Text style={styles.listItem}>• First Item</Text>
        <Text style={styles.listItem}>• Second Item</Text>
        <Text style={styles.listItem}>• Third Item</Text>
      </View>
    </Page>
  </Document>
);

export default ResultPDF;
