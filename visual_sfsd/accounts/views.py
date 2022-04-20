from django.shortcuts import render, redirect
from django.contrib import messages
from .forms import UserRegistrationForm


def login(request):
    return render(request, 'accounts/login/index.html')


# def register(request):
#     return render(request, 'accounts/register/index.html')
#

def register(request):
    if request.method == 'POST':
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            new_user = form.save(commit=False)
            new_user.set_password(
                form.cleaned_data['password']
            )
            new_user.username = f"{new_user.first_name.lower()[0]}_{new_user.last_name.lower().replace(' ', '_')}"
            new_user.save()

            messages.success(request, "Your account has been created successfully, you can login now")

            return redirect('login')

    form = UserRegistrationForm()
    context = {'form': form}
    return render(request, 'accounts/register/index.html', context)


def settings(request):
    return render(request, 'accounts/settings/index.html')
