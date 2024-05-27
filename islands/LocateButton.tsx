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
    <div class="w-[96.5%] flex justify-center">
      <button
        class="w-1/2 hover:w-2/3 duration-300 rounded-full py-3 translate-x-3 flex items-center justify-center bg-black"
        onClick={() => getLoc()}
      >
        <img class="invert" src="/map-pin.svg" alt="Locate" />
        <p class="text-white">Locate</p>
      </button>
    </div>
  );
}
