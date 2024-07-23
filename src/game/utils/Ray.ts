interface Ray {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export const castRay = (
  startX: number,
  startY: number,
  stepLength: number
): Ray => {
  return {
    startX: startX,
    startY: startY,
    endX: startX,
    endY: startY + stepLength,
  };
};

export const checkIntersectHorizontalEdge = (
  ray: Ray,
  edge: number
): boolean => {
  if (edge >= ray.startY && edge <= ray.endY) {
    return true;
  }
  return false;
};
