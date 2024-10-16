import { Line, QRCode, Text } from "react-thermal-printer";

const Footer = () => (
  <>
    <Line />
    <Text>Se sei soddisfatto del nostro servizio per favor dacci un giudizio</Text>
    <QRCode content="https://github.com/seokju-na/react-thermal-printer" />
    <Text>E goditi l'offerta dedicata a te</Text>
    <Text>
      TODO: arrivederci
    </Text>
  </>
);

export default Footer;
