function run() {
  setInterval(() => {
    console.log("yo")
  }, 30000)
}
console.log(`hi ${process.env.NAME}`)

run()
