export const calculateLevel = (xp: number) => {
  return Math.floor(xp / 500) + 1;
};

export const xpForNextLevel = (level: number) => {
  return level * 500;
};