const setMapLocation = (countryLat = 41.649569795023865, countryLng = 41.64118545963192, zoom = 12) => {
	const options = {
		center: {
			lat: Number(countryLat),
			lng: Number(countryLng)
		},
		zoom: zoom
	}

	const map = new google.maps.Map(document.getElementById('map'), options)
}

$(function () {

	// Custom JS

	setMapLocation()

	// Делаем кнопку таба во втором блоке активной
	const btnContainer = document.querySelector(".block-2_tabs")
	const btns = btnContainer.getElementsByClassName("block-2_tab")

	for (let i = 0; i < btns.length; i++) {
		btns[i].addEventListener("click", function () {
			let current = document.getElementsByClassName("btn-active")
			current[0].className = current[0].className.replace(" btn-active", "")
			this.className += " btn-active"
		});
	}

	// Скролл табов при клике
	const containerOuterWidth = $('.block-2_tabs').outerWidth();
	$(".block-2_tab").click(function () {
		const itemOuterWidth = $(this).outerWidth()
		const itemOffsetLeft = $(this).offset().left
		const containerScrollLeft = $(".block-2_tabs").scrollLeft()
		let positionCetner = (containerOuterWidth / 2 - itemOuterWidth / 2)
		let scrollLeftUpd = containerScrollLeft + itemOffsetLeft - positionCetner
		$('.block-2_tabs').animate({
			scrollLeft: scrollLeftUpd
		}, 400);
	});

	//Переключение картинок по табу во втором блоке
	$('[data-open-block').on('click', function () {
		const activeCls = 'block-2_img--active';

		$('[data-content]').removeClass(activeCls);
		$(`[data-content="${$(this).data('open-block')}"`).addClass(activeCls);
	});

	// Получаем и отображаем данные на карте
	const selectCountry = document.querySelector('.country')

	fetch('https://cs.wialon.com/svcs/regions/v1/countries?extended=1')
		.then(function (response) {
			if (response.status !== 200) {
				return Promise.reject(new Error(response.statusText))
			}
			return Promise.resolve(response)
		})
		.then(function (response) {
			return response.json()
		})
		.then(function (data) {
			data.map((e) => {
				const country = e.name
				const countryId = e.id
				const countryLat = e.latitude
				const countryLng = e.longitude
				const createOption = new Option(country, `${countryId},${countryLat},${countryLng}`)
				selectCountry.append(createOption)
			})
			return data
		})
		.then(function (data) {

		})
		.catch(function (error) {
			console.log('error', error)
		})

	selectCountry.addEventListener('change', function () {
		const [countryId, countryLat, countryLng] = this.value.split(',')

		setMapLocation(countryLat, countryLng, 5)

		if (countryId) {

			const selectCity = document.querySelector('.city')
			selectCity.removeAttribute('disabled')

			fetch(`https://cs.wialon.com/svcs/regions/v1/cities?extended=1&country_id={${countryId}}`)
				.then(function (response) {
					if (response.status !== 200) {
						return Promise.reject(new Error(response.statusText))
					}
					return Promise.resolve(response)
				})
				.then(function (response) {
					return response.json()
				})
				.then(function (data) {
					data.map((e) => {
						const city = e.name
						const cityLat = e.latitude
						const cityLng = e.longitude
						const newOption = new Option(city);
						const selectCity = document.querySelector('.city')
						selectCity.append(newOption);
						selectCity.addEventListener('change', () => {
							setMapLocation(cityLat, cityLng, 10)
						})
					})
				})
				.catch(function (error) {
					console.log('error', error)
				})
		} else {
			selectCity.setAttribute('disabled')
		}
	});

	//Popup
	const openPopup = document.querySelector('.btn-form')
	const formPopup = document.querySelector('.form')
	const closePopup = document.querySelector('.close')
	const formContent = document.querySelector('.form_content')

	openPopup.addEventListener('click', (e) => {
		e.preventDefault()
		formPopup.classList.remove('hidden')
	})

	closePopup.addEventListener('click', () => {
		formPopup.classList.add('hidden')
	})

	$(".form").on('click', function (e) {
        if (e.target == this) $(".form").addClass('hidden');
    });

	$(function () {
		$('a[href^="#"]').on('click', function (event) {
			event.preventDefault();
			var sc = $(this).attr("href"),
				dn = $(sc).offset().top;
			$('html, body').animate({
				scrollTop: dn
			}, 1000);
		});
	});

});