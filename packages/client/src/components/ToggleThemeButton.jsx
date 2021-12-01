import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Button, useColorMode } from "@chakra-ui/react";

const ToggleThemeButton = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Button
      onClick={toggleColorMode}
      pos="absolute"
      top="0"
      right="0"
      m="1rem"
      rounded="md"
    >
      {colorMode === "dark" ? (
        <SunIcon color="orange.100" />
      ) : (
        <MoonIcon color="blue.900" />
      )}
    </Button>
  );
};

export default ToggleThemeButton;
