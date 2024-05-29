export default function LocateButton() {
  function getLoc() {
    navigator.geolocation.getCurrentPosition((pos) => {
      console.log(pos.coords.latitude);
      console.log(pos.coords.longitude);
      location.assign(
        "/?q=" + pos.coords.latitude + "," + pos.coords.longitude,
      );
    }, (err) => {
      console.error(err.message);
    });
  }

  return (
    <div class="w-[96.5%] flex justify-center fixed top-2 left-2">
      <button
        class="w-12 hover:scale-105 h-12 fixed top-2 left-2 duration-300 rounded-full py-3 translate-x-3 flex items-center justify-center bg-black"
        onClick={() => getLoc()}
      >
        <img class="invert" src="/map-pin.svg" alt="Locate" />
      </button>
    </div>
  );
}
