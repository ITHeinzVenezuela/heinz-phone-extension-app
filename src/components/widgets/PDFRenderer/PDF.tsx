import React, { useEffect } from 'react'
import { Document, Text, Page, StyleSheet, View, PDFDownloadLink } from '@react-pdf/renderer'
// import { getCuteFullDate, shortDate, shortTime } from '@/utils/parseDate'
import { PDFProps } from './types/PDFRendererType'
import { formatExtensions, sortByDepAlphabetically } from '@/utils'
import { Department } from '@/pages/api/_schemas/department.schema'

const utils = {
  flexGrow2: {
    left: {
      flexGrow: 1,
    },
    right: {
      flexGrow: 1,
    }
  },

  flexGrow3: {
    left: {
      flexGrow: 1,
    },
    middle: {
      flexGrow: 1,
    },
    right: {
      flexGrow: 1,
    }
  },
}

const classes = {
  header: StyleSheet.create({
    styles: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      gap: "10px",
      borderBottom: "2px solid black",
      paddingBottom: "5px",
      marginBottom: "5px"
    },
    left: {
      flexGrow: 5,
    },
    middle: {
      flexGrow: 3,
    },
    right: {
      flexGrow: 1,
      marginLeft: "20px"
    }
  }),


  container: StyleSheet.create({
    styles: {
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      gap: "5px"
    },
  }),

  department: StyleSheet.create({
    styles: {
      // display: "flex",
      // flexDirection: "row",
      // justifyContent: "space-between",
      // padding: "5px",
      border: "1px solid black",
      padding: "2px",
    },
    title: {
      marginBottom: "2px",
      fontSize: "8px",
      padding: "3px",
      fontWeight: 500,
      backgroundColor: "#94a3b8"
    }
  }),

  person: StyleSheet.create({
    styles: {
      padding: "0 3px",
      display: "flex",
      flexDirection: "row",
      gap: "5px",
      justifyContent: "space-between",
    },
    name: {
      fontSize: "8px",
    },
    extension: {
      fontSize: "8px",
      // paddingLeft: "5px"
    }
  }),

  // weights: StyleSheet.create({
  //   styles: {
  //     display: "flex",
  //     flexDirection: "row",
  //     justifyContent: "space-between",
  //     paddingBottom: "20px"
  //   },
  //   ...utils.flexGrow3
  // }),

  // details: StyleSheet.create({
  //   styles: {
  //     display: "flex",
  //     flexDirection: "row",
  //   },
  //   text: {
  //     flexGrow: 1,
  //     display: "flex",
  //     gap: "5px"
  //   }
  // }),

  // signatures: StyleSheet.create({
  //   styles: {
  //     padding: "200px 100px 0px",
  //     display: "flex",
  //     flexDirection: "row",
  //     gap: "20px",
  //   },
  //   border: {
  //     borderTop: "1px solid black",
  //     paddingTop: "5px",
  //     display: "flex",
  //     justifyContent: "center",
  //     flexDirection: "row",
  //     flexGrow: 1,
  //   },
  // })
}

const styles = StyleSheet.create({
  page: {
    // display: "flex",
    padding: "10px"
  },
  title: {
    fontSize: "14px",
    fontWeight: "extrabold",
    textAlign: "center",
  },
  container: {
    display: "flex",
    gap: "5px",
  },
  indent: {
    paddingLeft: "10px"
  },
  subtitle: {
    fontSize: "12px",
    fontWeight: "extrabold",
    paddingBottom: "5px",
  },
  listItem: {
    display: "flex",
    flexDirection: "row",
    gap: "10px",
  },
  text: {
    fontSize: "8px",
  },
  textCenter: {
    fontSize: "12px",
    textAlign: "center",
  },
  small: {
    paddingLeft: "10px",
    fontSize: "10px",
  },
})

const { header, department, person, container } = classes

const PDF = ({ extensions }: PDFProps) => {

  const orderedExtensions = sortByDepAlphabetically(extensions)
  const departmentsData = orderedExtensions.map(({ department }) => department)
  const sortedDepartments = [...new Set(departmentsData.map(({ id }) => id))]

  const filteredDepartments = sortedDepartments.map((departmentId) => {
    return departmentsData.find((department) => 
      department.id === departmentId
    )
  }) as Department[]

  console.log('filteredDepartments', filteredDepartments)

  const departments = filteredDepartments.map(({ id: departmentId, name }) => {
    return {
      id: departmentId,
      name,
      extensions: extensions.filter(({ department }) => department.id === departmentId)
    }
  })

  return (
    <Document>
      <Page orientation="landscape">

        <View style={styles.page}>
          <View style={header.styles}>
            <View style={header.left}>
              <Text style={styles.text}>Alimentos Heinz C.A.</Text>
              <Text style={styles.small}>Planta San Joaquín</Text>
            </View>

            <View style={header.middle}>
              <Text style={styles.title}>Directorio de Extensiones</Text>
            </View>

            <View style={header.right}>
              {/* <Text style={styles.small}>Fecha: {shortDate(exitDate)}</Text> */}
              {/* <Text style={styles.small}>Hora: {shortTime(exitDate)}</Text> */}
            </View>
          </View>

          <View style={container.styles}>
            {
              departments.map(({ id, name, extensions }, index) =>
                <View key={index} style={department.styles}>
                  <Text style={department.title}>{name}</Text>
                  {
                    formatExtensions(extensions).map(({ number, employee }, index) =>
                      <View key={index} style={person.styles}>
                        <Text style={styles.text}>{employee.name}</Text>
                        <Text style={styles.text}>{number?.join(", ")}</Text>
                      </View>
                    )
                  }
                </View>
              )
            }
          </View>

        </View>

      </Page>
    </Document>
  )
}

export default PDF;