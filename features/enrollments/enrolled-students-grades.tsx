/* eslint-disable jsx-a11y/alt-text */
"use client"

import { School } from "@prisma/client"
import {
  Document,
  Image,
  Page,
  PDFViewer,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer/lib/react-pdf.browser"

import {
  GetStudentGradeReportArgs,
  StudentGradeReportQueryResponse,
  StudentSubjectsGradeMapValue,
  useStudentGradeReport,
} from "@/hooks/use-student-grade-report"

// Create styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    fontFamily: "Times-Roman",
    paddingVertical: 32,
  },
  heading: {
    marginVertical: 10,
    marginHorizontal: 40,
    display: "flex",
    flexDirection: "row",
  },
  heading2: {
    marginVertical: 10,
    alignItems: "center",
    textAlign: "center",
  },
  details: {
    marginVertical: 10,
    marginHorizontal: 30,
    fontSize: 10,
  },
  logo: {
    width: 40,
    height: 40,
  },
  headingText: {
    fontSize: 9,
    flexGrow: 1,
    alignItems: "center",
  },
  headingTextLine1: {
    fontSize: 9,
  },
  headingTextLine2: {
    fontSize: 9,
  },
  headingTextLine3: {
    fontSize: 9,
    textTransform: "uppercase",
  },
  headingTextLine4: {
    fontSize: 9,
    fontWeight: "semibold",
    textTransform: "uppercase",
  },
  row: { flexDirection: "row", borderBottom: "1px solid black" },
  cellSubject: {
    borderRight: "1px solid black",
    fontWeight: "semibold",
    padding: 4,
    flex: 1,
    flexShrink: 0,
  },
  cellGrade: {
    textAlign: "center",
    borderRight: "1px solid black",
    padding: 4,
    width: 30,
  },
  cellFinalGrade: {
    textAlign: "center",
    padding: 4,
    borderRight: "1px solid black",
    width: 70,
  },
  cellRemark: {
    textAlign: "center",
    padding: 4,
    width: 70,
  },
})

function StudentReportCard({
  school,
  enrollment,
  studentGradeReport,
}: {
  enrollment: StudentGradeReportQueryResponse["enrollment"]
  school: School
  studentGradeReport: StudentSubjectsGradeMapValue
}) {
  return (
    <Page size="A5" orientation="portrait" style={{ paddingVertical: 10 }}>
      <View style={styles.heading}>
        <Image
          src={
            process.env.NEXT_PUBLIC_SITE_URL +
            "/images/cert-media/deped_logo.png"
          }
          style={styles.logo}
        />
        <View style={styles.headingText}>
          <Text style={styles.headingTextLine1}>
            Republic of the Philippines
          </Text>
          <Text style={styles.headingTextLine2}>Department of Education</Text>
          <Text style={styles.headingTextLine3}>Region IV-A CALABARZON</Text>
          <Text style={styles.headingTextLine3}>Division of Rizal</Text>
          <Text style={styles.headingTextLine4}>{school.name}</Text>
        </View>
        <Image
          src={
            process.env.NEXT_PUBLIC_SITE_URL + "/images/cert-media/mnhs.jpeg"
          }
          style={styles.logo}
        />
      </View>
      <View style={styles.heading2}>
        <Text style={styles.headingTextLine4}>Progress Report Card</Text>
        <Text style={styles.headingTextLine4}>
          S.Y. {enrollment.schoolYear}
        </Text>
      </View>
      <View style={styles.details}>
        <View style={{ flexDirection: "row", marginBottom: 3 }}>
          <Text style={{ fontWeight: "semibold" }}>Name: </Text>
          <Text>{studentGradeReport.studentName}</Text>
          <Text style={{ fontWeight: "semibold", marginLeft: "auto" }}>
            LRN:{" "}
          </Text>
          <Text>{studentGradeReport.studentNumber}</Text>
        </View>
        <View style={{ flexDirection: "row", marginBottom: 3 }}>
          <Text style={{ fontWeight: "semibold" }}>Age: </Text>
          <Text>{studentGradeReport.studentAge}</Text>
          <Text style={{ fontWeight: "semibold", marginLeft: "auto" }}>
            Sex:{" "}
          </Text>
          <Text style={{ textTransform: "capitalize" }}>
            {studentGradeReport.gender.toLowerCase()}
          </Text>
        </View>
        <View style={{ flexDirection: "row", marginBottom: 3 }}>
          <Text style={{ fontWeight: "semibold" }}>Grade & Section: </Text>
          <Text>
            {enrollment.gradeLevel} - {enrollment.section}
          </Text>
        </View>
      </View>
      <Text
        style={{
          textAlign: "center",
          fontSize: 9,
          fontWeight: "semibold",
          textTransform: "uppercase",
          marginBottom: 5,
        }}
      >
        Report on Learning Progress and Achievement
      </Text>
      <View
        style={{
          marginHorizontal: 30,
          height: 3,
          borderBottom: "1px solid black",
          borderTop: "1px solid black",
        }}
      ></View>
      <Text
        style={{
          textAlign: "center",
          fontSize: 9,
          fontWeight: "semibold",
          textTransform: "uppercase",
          marginVertical: 5,
        }}
      >
        Periodic Rating
      </Text>
      <View
        style={{
          border: "1px solid black",
          borderBottom: 0,
          marginHorizontal: 30,
          fontSize: 9,
        }}
      >
        <View style={{ ...styles.row, fontWeight: "semibold" }}>
          <View style={styles.cellSubject}>
            <Text>Learning Area</Text>
          </View>
          {studentGradeReport.subjectGrades
            ?.at(0)
            ?.periodicFinalGrades.map((periodicGrade) => (
              <View key={periodicGrade.periodId} style={styles.cellGrade}>
                <Text>{periodicGrade.periodName}</Text>
              </View>
            ))}
          <View style={styles.cellFinalGrade}>
            <Text>Final Grade</Text>
          </View>
          <View style={styles.cellRemark}>
            <Text>Remarks</Text>
          </View>
        </View>
        {studentGradeReport.subjectGrades.map((subjectGrade) => (
          <View key={subjectGrade.subjectId} style={styles.row}>
            <View style={styles.cellSubject}>
              <Text>{subjectGrade.subjectName}</Text>
            </View>
            {subjectGrade.periodicFinalGrades.map((periodicGrade) => (
              <View key={periodicGrade.periodId} style={styles.cellGrade}>
                <Text>{periodicGrade.periodicGrade.toFixed(0)}</Text>
              </View>
            ))}
            <View style={styles.cellFinalGrade}>
              <Text>{subjectGrade.finalGrade.toFixed(0)}</Text>
            </View>
            <View style={styles.cellRemark}>
              <Text>Passed</Text>
            </View>
          </View>
        ))}
        <View style={styles.row}>
          <View style={styles.cellSubject}>
            <Text>Average</Text>
          </View>
          {studentGradeReport.allSubjectPeriodicAverages.map((average) => (
            <View key={`average-${average.periodId}`} style={styles.cellGrade}>
              <Text>{average.periodicAverage.toFixed(0)}</Text>
            </View>
          ))}
          <View style={styles.cellFinalGrade}>
            <Text>{studentGradeReport.allSubjectAverage.toFixed(0)}</Text>
          </View>
          <View style={styles.cellRemark}>
            <Text>Passed</Text>
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          marginHorizontal: 30,
          marginTop: 10,
          fontSize: 9,
          fontWeight: "semibold",
        }}
      >
        <View>
          <Text>Description</Text>
          <Text>Outstanding</Text>
          <Text>Very Satisfactory</Text>
          <Text>Satisfactory</Text>
          <Text>Fairly Satisfactory</Text>
          <Text>Did not meet expect expectations</Text>
        </View>
        <View>
          <Text>Grading Scale</Text>
          <Text>90-100</Text>
          <Text>85-89</Text>
          <Text>80-84</Text>
          <Text>75-79</Text>
          <Text>Below 75</Text>
        </View>
        <View>
          <Text>Remarks</Text>
          <Text>Passed</Text>
          <Text>Passed</Text>
          <Text>Passed</Text>
          <Text>Passed</Text>
          <Text>Failed</Text>
        </View>
      </View>
    </Page>
  )
}

export function EnrolledStudentsGrades(props: GetStudentGradeReportArgs) {
  const report = useStudentGradeReport(props)

  return (
    <PDFViewer
      className="aspect-square size-full overflow-hidden"
      style={{
        width: "100%",
        height: "100%",
        border: "none",
        backgroundColor: "#f0f0f0",
      }}
    >
      <Document title="Student Progress Report Card">
        {report.data?.studentsGradesReport.map((studentGradeReport) => (
          <StudentReportCard
            key={studentGradeReport.studentId}
            school={report.data.school}
            enrollment={report.data.enrollment}
            studentGradeReport={studentGradeReport}
          />
        ))}
      </Document>
    </PDFViewer>
  )
}
