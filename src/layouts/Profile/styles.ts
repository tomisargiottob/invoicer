import { styled } from "styled-components";

export const ProfileSection = styled.div`
    background-color: #C9D6E1;
    min-height: 100vh;
    min-width: 800px;
    padding: 20px;
`

export const ProfileTitle = styled.h1`
    text-align: center;
`

export const SecondaryTitle = styled.h3`

`
export const TableData = styled.div`
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    -webkit-box-shadow: 10px 10px 10px 0px rgba(158,158,158,0.64);
    -moz-box-shadow: 10px 10px 10px 0px rgba(158,158,158,0.64);
    box-shadow: 10px 10px 10px 0px rgba(158,158,158,0.64);
    margin: 0 auto;
    margin-bottom: 20px;
    max-width: 800px;
`
export const TableSpace = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px;
`

export const TableLabel = styled.div`
    color: blue;
    padding-bottom: 20px;
`

export const TableValue = styled.div`
    display: flex;
`

export const FakePassword = styled.span`
    -webkit-text-security: none;
    -webkit-text-security: circle;
    -webkit-text-security: square; 
    -webkit-text-security: disc;
`

export const StatusLight = styled.div<{color: string}>`
    background-color: ${({color})=> color};
    width: 10px;
    height: 10px;
    border-radius: 5px;
    position: relative;
    top: 4px;
    margin-right: 10px;
`

export const WarningMessage = styled.div`
    color: red;

`
export const ConfirmSuscription= styled.button`
    padding: 10px;
    background-color: green;
    margin-top: 20px;
    color: white;
    border-radius: 5px;
    cursor: pointer;
`
export const CancelSuscription= styled.button`
    padding: 10px;
    background-color: red;
    color: white;
    border-radius: 5px;
    cursor: pointer;
`

export const Separator = styled.div`
    height:1px;
    width: 100%;
    background-color: gray;
    margin: 10px 0px;
`

export const SuscriptionSection = styled.div`
    display: flex;
    flex-direction: column;
    width: 30%;
    margin: 0 auto;
`