from django.contrib.auth.models import User
from django.apps import apps
from django.contrib.auth.decorators import login_required
from django.http import Http404
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from .models import Account
from .forms import UserRegistrationForm

File = apps.get_model(app_label='files', model_name='File')


def login_page(request):
    # if user is already logged in, redirect him to the home page
    if request.user.is_authenticated:
        return redirect('home')

    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            messages.success(request, f'You are logged in as {username}')

            next_url = request.GET.get('next')
            if next_url:  # redirect user to "next" parameter (if it exists) after login
                return redirect(next_url)
            else:
                return redirect('dashboard')
        else:
            messages.error(request, 'Wrong username or password')

    context = {}
    return render(request, 'accounts/login/index.html', context)


def logout_user(request):
    logout(request)
    return redirect('home')


def register(request):
    # if user is already logged in, redirect him to the home page
    if request.user.is_authenticated:
        return redirect('home')

    if request.method == 'POST':
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            # create User object
            user = form.save(commit=False)
            user.set_password(
                form.cleaned_data['password']
            )
            user.username = f"{user.first_name.lower()[0]}_{user.last_name.lower().replace(' ', '_')}"
            user.save()

            # create Account object associated for the user
            account = Account(user=user, role='student')
            account.save()

            messages.success(request, "Your account has been created successfully, you can login now")
            return redirect('login')
        else:
            for field in form.errors:
                form[field].field.widget.attrs['class'] += ' bg-red-50 border border-red-500 text-red-900 placeholder-red-700 focus:outline-red-500'
    else:
        form = UserRegistrationForm()

    context = {'form': form}
    return render(request, 'accounts/register/index.html', context)


@login_required
def settings(request):
    return render(request, 'accounts/settings/index.html')


@login_required
def profile(request, username):
    try:
        user = User.objects.get(username=username)

        files_all = File.objects.filter(
            owner=user, is_public=True
        ).order_by('-date_created')

        paginator = Paginator(files_all, 3)
        page = request.GET.get('page')
        try:
            files = paginator.page(page)
        except PageNotAnInteger:
            files = paginator.page(1)
        except EmptyPage:
            files = paginator.page(paginator.num_pages)

        context = {
            'user': user,
            'files': files,
        }

        return render(request, 'accounts/profile/index.html', context)
    except:
        raise Http404
