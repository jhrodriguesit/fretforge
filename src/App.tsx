import { useHashRoute } from './hooks/useHashRoute';
import Header from './components/Header/Header';
import Landing from './components/Landing/Landing';
import HarmonyView from './views/HarmonyView';
import ScalesView from './views/ScalesView';
import EarTrainingView from './views/EarTrainingView';

const App = () => {
  const route = useHashRoute();

  if (route === 'harmony') {
    return (
      <>
        <Header active="harmony" />
        <HarmonyView />
      </>
    );
  }
  if (route === 'scales') {
    return (
      <>
        <Header active="scales" />
        <ScalesView />
      </>
    );
  }
  if (route === 'ear-training') {
    return (
      <>
        <Header active="ear-training" />
        <EarTrainingView />
      </>
    );
  }
  return (
    <>
      <Header active="" />
      <Landing />
    </>
  );
};

export default App;
