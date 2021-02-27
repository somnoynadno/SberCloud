import * as React from "react"
import Svg, { Path } from "react-native-svg"

function APM(props) {
    return (
        <Svg
            width={27}
            height={27}
            viewBox="0 0 27 27"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2.077 2.077v5.192A1.038 1.038 0 110 7.27V2.077C0 .93.93 0 2.077 0h5.192a1.038 1.038 0 110 2.077H2.077zm22.846 0h-5.192a1.038 1.038 0 110-2.077h5.192C26.071 0 27 .93 27 2.077v5.192a1.038 1.038 0 11-2.077 0V2.077zM7.27 24.923H2.077v-5.192a1.039 1.039 0 00-2.077 0v5.192C0 26.07.93 27 2.077 27h5.192a1.038 1.038 0 100-2.077zm17.654 0v-5.192a1.038 1.038 0 112.077 0v5.192C27 26.07 26.07 27 24.923 27h-5.192a1.038 1.038 0 110-2.077h5.192z"
                fill="#D2D2D2"
            />
            <Path
                d="M19.698 13.058h0l-.003.007-1.048 2.532-2.182-8.432a.29.29 0 00-.017-.047.838.838 0 00-.18-.26.529.529 0 00-.361-.158.591.591 0 00-.556.398l-1.69 5.95-.74-1.783h0l-.003-.007a.591.591 0 00-.541-.358.591.591 0 00-.55.381l-1.816 5.19-1.944-7.447a.839.839 0 00-.196-.305.529.529 0 00-.362-.159.529.529 0 00-.361.159.839.839 0 00-.18.259.3.3 0 00-.02.063l-.86 4.259h-3.82c-.16 0-.31.062-.418.183a.62.62 0 00-.15.417c0 .149.045.3.15.417.107.121.258.183.417.183h4.28a.591.591 0 00.56-.414l.53-2.338 1.829 7.028c.004.015.01.031.016.046l.009.022c.02.047.06.144.109.218.07.105.205.238.423.238.112 0 .2-.047.255-.087a.68.68 0 00.136-.134 1.281 1.281 0 00.161-.283l1.881-5.593.766 1.89h0l.004.01c.103.23.319.357.541.357.16 0 .283-.084.352-.148a.58.58 0 00.102-.125.43.43 0 00.056-.148l1.57-5.537 2.177 8.017a.83.83 0 00.152.264c.063.069.132.118.205.159a.3.3 0 00.147.038.591.591 0 00.541-.358h0l.004-.008L20.6 13.9h4.132c.16 0 .31-.062.417-.183a.62.62 0 00.15-.417.62.62 0 00-.15-.417.552.552 0 00-.417-.183h-4.494a.591.591 0 00-.54.358z"
                fill="#D2D2D2"
                stroke="#D2D2D2"
                strokeWidth={0.6}
                strokeLinejoin="round"
            />
        </Svg>
    )
}

export default APM
