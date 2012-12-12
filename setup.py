#!/usr/bin/env python
from distutils.core import setup
from appy import version

setup(
    name='appy',
    version=version.short,
    packages=['appy', 'appy.shared', 'appy.pod'],
    description='The Appy framework',
    author='Sylvain Fankhauser',
    author_email='sylvain.fankhauser@gmail.com',
    url='http://appyframework.org',
)
