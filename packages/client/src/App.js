import AccountContext from "./components/AccountContext";
import ToggleThemeButton from "./components/ToggleThemeButton";
import Views from "./components/Views";

function App() {
  return (
    <AccountContext>
      <Views />
      <ToggleThemeButton />
    </AccountContext>
  );
}

export default App;
