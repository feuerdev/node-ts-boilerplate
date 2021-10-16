console.log(`hi ${process.env.NAME}`)

function run() {
  setInterval(() => {
    console.log("yo")
  }, 30000)
}

run()
