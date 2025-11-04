import {Dimensions,Platform} from 'react-native';
const { height , width } = Dimensions.get("window");

const StyleGuide = {
    spacing: 8,
    palette: {
      primary: "#3884ff",
      backgroundPrimary: "#d5e5ff",
      background: "#f2f2f2",
      border: "#f2f2f2",
    },

    typography: {
      body: {
        fontSize: 17,
        lineHeight: 20,
        fontFamily: "SFProText-Regular",
      },
      callout: {
        fontSize: 16,
        lineHeight: 20,
        fontFamily: "SFProText-Regular",
      },
      caption: {
        fontSize: 11,
        lineHeight: 13,
        fontFamily: "SFProText-Regular",
      },
      footnote: {
        fontSize: 13,
        lineHeight: 18,
        fontFamily: "SFProText-Regular",
        color: "#999999",
      },
      headline: {
        fontSize: 17,
        lineHeight: 22,
        fontFamily: "SFProText-Semibold",
      },
      subhead: {
        fontSize: 15,
        lineHeight: 20,
        fontFamily: "SFProText-Bold",
      },
      title1: {
        fontSize: 34,
        lineHeight: 41,
        fontFamily: "SFProText-Bold",
      },
      title2: {
        fontSize: 28,
        lineHeight: 34,
        fontFamily: "SFProText-Bold",
      },
      title3: {
        fontSize: 22,
        lineHeight: 26,
        fontFamily: "SFProText-Bold",
      },
    },

    toastAlert : {
      backgroundColor:       '#cc3300',
                             width: width,
                             height: Platform.OS === ("ios") ? 75 : 150,
                             color: "#ffffff",
                             fontSize: 15,
                             lineHeight: 2,
                             lines: 4,
                             borderRadius: 15,
                             borderColor:'#FFFFFF',
                             borderWidth : 2,
                             fontWeight: "bold",
                             yOffset: 20
    },
    toastWarning : {
      backgroundColor:       '#ffcc00',
                             width: width,
                             height: Platform.OS === ("ios") ? 75 : 150,
                             color: "#ffffff",
                             fontSize: 15,
                             lineHeight: 2,
                             lines: 4,
                             borderRadius: 15,
                             borderColor:'#FFFFFF',
                             borderWidth : 2,
                             fontWeight: "bold",
                             yOffset: 20
    },
    toastInfo : {
      backgroundColor:       '#828282',
                             width: width,
                             height: Platform.OS === ("ios") ? 75 : 150,
                             color: "#ffffff",
                             fontSize: 15,
                             lineHeight: 2,
                             lines: 4,
                             borderRadius: 15,
                             borderColor:'#FFFFFF',
                             borderWidth : 2,
                             fontWeight: "bold",
                             yOffset: 20
    },
    toastSuccess : {
      backgroundColor:       '#99cc33',
                             width: width,
                             height: Platform.OS === ("ios") ? 75 : 150,
                             color: "#ffffff",
                             fontSize: 15,
                             lineHeight: 2,
                             lines: 4,
                             borderRadius: 15,
                             borderColor:'#FFFFFF',
                             borderWidth : 2,
                             fontWeight: "bold",
                             yOffset: 20
    }
  };

  export default StyleGuide;