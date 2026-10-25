import packageJson from '../../package.json'

export const WINS_BAILEYS = {
  name: 'WINS Baileys',
  packageName: packageJson.name,
  version: packageJson.version,
  author: 'WINS OFFICIAL',
  getInfo() {
    return {
      name: this.name,
      packageName: this.packageName,
      version: this.version,
      author: this.author
    }
  }
}
