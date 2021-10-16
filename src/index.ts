function run() {
  setInterval(() => {
    console.log("yoi")
  }, 30000)
}
console.log(`hi ${process.env.NAME}`)

run()
