const avatarAssets = [
  require('../../assets/avatars/avatar-01.png'),
  require('../../assets/avatars/avatar-02.png'),
  require('../../assets/avatars/avatar-03.png'),
  require('../../assets/avatars/avatar-04.png'),
  require('../../assets/avatars/avatar-05.png'),
  require('../../assets/avatars/avatar-06.png'),
  require('../../assets/avatars/avatar-07.png'),
];

function hashName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = ((h << 5) - h) + name.charCodeAt(i);
  return Math.abs(h);
}

export function getAvatarByIndex(index: number) {
  return avatarAssets[index % avatarAssets.length];
}

export function getAvatarByName(name: string) {
  return avatarAssets[(hashName(name) + name.length) % avatarAssets.length];
}
