import ReactDOM from 'react-dom';
import { ReactNode } from 'react';

interface ModalPortalProps {
    children: ReactNode;
}

export default function ModalPortal({ children }: ModalPortalProps) {
    return ReactDOM.createPortal(
        children,
        document.body
    );
}
