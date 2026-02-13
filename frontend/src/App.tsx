import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { ColorPicker, Text } from "@mantine/core";

function App() {
  const [count, setCount] = useState(0);
  const [value, onChange] = useState("rgba(47, 119, 150, 0.7)");
  return (
    <>
      <Text>Testing Doang</Text>
      <ColorPicker
        format="rgba"
        value={value}
        onChange={onChange}
      ></ColorPicker>
      <Text>{value}</Text>
    </>
  );
}

export default App;
