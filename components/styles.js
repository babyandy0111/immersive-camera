import styled from "styled-components";

export const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

export const Container = styled.div`
  width: 100%;
  ${({ aspectRatio }) =>
    aspectRatio === "cover"
      ? `
    position: absolute;
    bottom: 0;
    top: 0;
    left: 0;
    right: 0;`
      : `
    position: relative;
    padding-bottom: ${100 / aspectRatio}%;`}
`;

export const ErrorMsg = styled.div`
  padding: 40px;
`;

export const Cam = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
  transform: rotateY(${({ mirrored }) => (mirrored ? "180deg" : "0deg")});
`;

export const Canvas = styled.canvas`
  display: none;
`;
