import { Button, Box } from "@mantine/core";
import { HiMiniArrowUturnLeft } from "react-icons/hi2";

function BackButton() {
  return (
    <>
      <Button
        w="6rem"
        bdrs="4rem"
        leftSection={<HiMiniArrowUturnLeft />}
        onClick={() => history.back()}
      >
        Back
      </Button>
    </>
  );
}

export default BackButton;
