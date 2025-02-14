import {React, createContext, useContext, useReducer} from 'react'
import reducer from './reducer';

const initialState = {
    currentUser:null
};

const Context = createContext(initialState)

export const useValue = () => {
    return useContext(Context)
};

const ContextProvider = ({childern}) => {
    const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <contextProvider value={{state, dispatch}} >{childern}</contextProvider>
  );
};

export default ContextProvider