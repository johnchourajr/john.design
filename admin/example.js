import React, {StyleSheet, Dimensions, PixelRatio} from "react-native";
const {width, height, scale} = Dimensions.get("window"),
    vw = width / 100,
    vh = height / 100,
    vmin = Math.min(vw, vh),
    vmax = Math.max(vw, vh);

export default StyleSheet.create({
    "html": {
        "fontFamily": "\"Helvetica Neue\", Helvetica, Arial, sans-serif",
        "fontSize": 14,
        "color": "#444"
    },
    "body": {
        "fontFamily": "\"Helvetica Neue\", Helvetica, Arial, sans-serif",
        "fontSize": 14,
        "color": "#444",
        "paddingTop": 20,
        "paddingRight": 20,
        "paddingBottom": 20,
        "paddingLeft": 20
    },
    "h1": {
        "fontWeight": "bold",
        "color": "#666",
        "fontSize": 32,
        "marginTop": 20
    }
});