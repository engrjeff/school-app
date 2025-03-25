/* eslint-disable jsx-a11y/alt-text */
"use client"

import {
  Document,
  Font,
  Image,
  Page,
  PDFViewer,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer"

// Register font
Font.register({
  family: "LibreBaskerville",
  src: "http://fonts.gstatic.com/s/librebaskerville/v4/pR0sBQVcY0JZc_ciXjFsKwAUTJOA6-irsSazDq377BE.ttf",
})

Font.register({
  family: "AlexBrush",
  src: "http://fonts.gstatic.com/s/alexbrush/v6/IdwaSrUcr-IskDo5YUNTVS3USBnSvpkopQaUR-2r7iU.ttf",
})

// Create styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    fontFamily: "Times-Roman",
    paddingVertical: 32,
    paddingHorizontal: 120,
  },
  heading: {
    margin: 10,
    display: "flex",
    flexDirection: "row",
  },
  headingText: {
    flexGrow: 1,
    alignItems: "center",
  },
  headingTextLine1: {
    fontSize: 16,
    marginBottom: 3,
    fontWeight: "semibold",
  },
  headingTextLine2: {
    fontSize: 16,
    fontWeight: "semibold",
  },
  headingTextLine3: {
    fontSize: 12,
    textTransform: "uppercase",
  },
  headingTextLine4: {
    fontSize: 12,
    fontWeight: "semibold",
    textTransform: "uppercase",
  },
  mainText: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
  },
  mainText2: {
    fontSize: 20,
    textAlign: "center",
    fontStyle: "italic",
  },
  name: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "AlexBrush",
    marginVertical: 16,
  },
  body: {
    fontSize: 20,
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 1.2,
  },
  strong: {
    fontWeight: "semibold",
  },
  signatory: {
    fontWeight: "semibold",
    textAlign: "center",
    textTransform: "uppercase",
    fontSize: 16,
    textDecoration: "underline",
  },
  signatoryPos: {
    textAlign: "center",
    fontSize: 16,
  },
})

export function CertificateTemplate({ name }: { name: string }) {
  return (
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
        }}
      >
        <Image
          src={
            process.env.NEXT_PUBLIC_SITE_URL +
            "/images/cert-media/cert-frame.png"
          }
          style={{ width: "100%", height: "100%" }}
        />
      </View>
      <View style={styles.heading}>
        <Image
          src={
            process.env.NEXT_PUBLIC_SITE_URL +
            "/images/cert-media/deped_logo.png"
          }
          style={{ width: 64, height: 64 }}
        />
        <View style={styles.headingText}>
          <Text style={styles.headingTextLine1}>
            Republic of the Philippines
          </Text>
          <Text style={styles.headingTextLine2}>Department of Education</Text>
          <Text style={styles.headingTextLine3}>Region IV-A CALABARZON</Text>
          <Text style={styles.headingTextLine3}>Division of Rizal</Text>
          <Text style={styles.headingTextLine4}>
            Morong National High School
          </Text>
        </View>
        <Image
          src={
            process.env.NEXT_PUBLIC_SITE_URL + "/images/cert-media/mnhs.jpeg"
          }
          style={{ width: 64, height: 64 }}
        />
      </View>

      <Text style={styles.mainText}>Certificate of Recognition</Text>
      <Text style={styles.mainText2}>This certificate is awarded to</Text>
      <Text style={styles.name}>{name}</Text>

      <View style={{ marginVertical: 8 }}>
        <Text style={styles.body}>
          In recognition of his/her exceptional performance as{" "}
          <Text style={styles.strong}>&quot;With Honors&quot;</Text>, achieving
          an average of <Text style={styles.strong}>93%</Text> during the School
          Year 2024-2025.
        </Text>
        <Text style={styles.body}>
          Given this 30th day of March, 2025 at Morong National High School,
          Morong, Rizal.
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          marginTop: 80,
          justifyContent: "space-between",
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Text style={styles.signatory}>John Doe</Text>
          <Text style={styles.signatoryPos}>Principal</Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.signatory}>Sarah Smith</Text>
          <Text style={styles.signatoryPos}>Adviser</Text>
        </View>
      </View>
    </Page>
  )
}

export function Certificates() {
  return (
    <PDFViewer style={{ width: "100%", height: "100%" }}>
      <Document title="Certificates">
        {Array.from(Array(10).keys()).map((n) => (
          <CertificateTemplate
            key={n + 1}
            name={`Matthew James Peterson${n + 1}`}
          />
        ))}
      </Document>
    </PDFViewer>
  )
}
